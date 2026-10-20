
import { db } from '../utils/db.js';
import {
  getJudge0LanguageName,
  submitBatch,
  pollBatchResults,
} from '../utils/judge0.js';

// Load authoritative test cases from the database.
const getTrustedTestCases = async (problemId) => {
  if (typeof problemId !== 'string' || !problemId.trim()) {
    const error = new Error('A valid problemId is required');
    error.statusCode = 400;
    throw error;
  }

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { id: true, testcases: true },
  });

  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  const testcases = problem.testcases;

  if (
    !Array.isArray(testcases) ||
    testcases.length === 0 ||
    !testcases.every(
      (testcase) =>
        testcase &&
        typeof testcase.input === 'string' &&
        typeof testcase.output === 'string'
    )
  ) {
    throw new Error('Problem has invalid test cases');
  }

  return testcases;
};

// Shared code execution logic.


const getOverallVerdict = (results, allPassed) => {
  if (allPassed) return "Accepted";

  const statusIds = results.map((result) => result.statusId);

  if (statusIds.includes(6)) return "Compilation Error";
  if (statusIds.includes(5)) return "Time Limit Exceeded";

  if (statusIds.some((id) => [7, 8, 9, 10, 11, 12].includes(id))) {
    return "Runtime Error";
  }

  if (statusIds.includes(14)) return "Execution Format Error";
  if (statusIds.includes(13)) return "Internal Error";

  return "Wrong Answer";
};

const evaluateCode = async ({
  source_code,
  language_id,
  stdin,
  expected_outputs,
}) => {
  if (
    typeof source_code !== 'string' ||
    !source_code.trim() ||
    !Number.isInteger(Number(language_id)) ||
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length ||
    !stdin.every((input) => typeof input === 'string') ||
    !expected_outputs.every((output) => typeof output === 'string')
  ) {
    throw new Error('Invalid code, language, or test cases');
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id: Number(language_id),
    stdin: input,
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((result) => result.token);

  if (
    tokens.length !== stdin.length ||
    tokens.some((token) => typeof token !== 'string' || !token)
  ) {
    throw new Error('Judge0 failed to create all submissions');
  }

  const results = await pollBatchResults(tokens);

  if (!Array.isArray(results) || results.length !== stdin.length) {
    throw new Error('Judge0 returned incomplete results');
  }

  let allPassed = true;

  const detailedResults = results.map((result, index) => {
    const status = result.status?.description ?? 'Unknown';
    const stdout = result.stdout?.trim() ?? null;
    const expected = expected_outputs[index].trim();

    // Only a normally completed execution can pass.
    const passed =
      result.status?.id === 3 &&
      stdout !== null &&
      stdout === expected;

    if (!passed) allPassed = false;

    return {
      testCase: index + 1,
      passed,
      stdout,
      expected,
      statusId: result.status?.id ?? null,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status,
      memory:
        result.memory != null ? `${result.memory} KB` : undefined,
      time: result.time != null ? `${result.time} s` : undefined,
    };
  });

  return { detailedResults, allPassed };
};

// 1. Run Code — custom input for interactive practice.
export const runCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs } = req.body;

    const { detailedResults, allPassed } = await evaluateCode({
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    return res.status(200).json({
      success: true,
      message: 'Code executed successfully',
      allPassed,
      testCases: detailedResults,
    });
  } catch (err) {
    console.error('Error running code:', err.message);

    return res.status(err.statusCode || 400).json({
      error: err.message,
    });
  }
};

// 2. Submit Code — trusted database test cases only.
export const submitCode = async (req, res) => {
  try {
    const { source_code, language_id, problemId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (
      typeof source_code !== 'string' ||
      !source_code.trim() ||
      !Number.isInteger(Number(language_id))
    ) {
      return res.status(400).json({
        error: 'Valid source code and language_id are required',
      });
    }

    // Ignore client-supplied stdin and expected_outputs.
    const trustedTestCases = await getTrustedTestCases(problemId);
    const stdin = trustedTestCases.map((testcase) => testcase.input);
    const expected_outputs = trustedTestCases.map(
      (testcase) => testcase.output
    );

    const { detailedResults, allPassed } = await evaluateCode({
      source_code,
      language_id: Number(language_id),
      stdin,
      expected_outputs,
    });

    const languageName = await getJudge0LanguageName(
      Number(language_id)
    );

    // Persist the submission and its test results together.
    const submissionWithTestCases = await db.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          userId,
          problemId,
          sourceCode: source_code,
          language: languageName,
          stdin: stdin.join('\n'),
          stdout: JSON.stringify(
            detailedResults.map((result) => result.stdout)
          ),
          stderr: detailedResults.some((result) => result.stderr)
            ? JSON.stringify(
                detailedResults.map((result) => result.stderr)
              )
            : null,
          compileOutput: detailedResults.some(
            (result) => result.compileOutput
          )
            ? JSON.stringify(
                detailedResults.map((result) => result.compileOutput)
              )
            : null,
          status: getOverallVerdict(detailedResults, allPassed),
          memory: detailedResults.some((result) => result.memory)
            ? JSON.stringify(
                detailedResults.map((result) => result.memory)
              )
            : null,
          time: detailedResults.some((result) => result.time)
            ? JSON.stringify(
                detailedResults.map((result) => result.time)
              )
            : null,
        },
      });

      await tx.testCaseResult.createMany({
        data: detailedResults.map((result) => ({
          submissionId: submission.id,
          testCase: result.testCase,
          passed: result.passed,
          stdout: result.stdout,
          expected: result.expected,
          stderr: result.stderr,
          compileOutput: result.compileOutput,
          status: result.status,
          memory: result.memory,
          time: result.time,
        })),
      });

      if (allPassed) {
        await tx.problemSolved.upsert({
          where: {
            userId_problemId: {
              userId,
              problemId,
            },
          },
          update: {},
          create: {
            userId,
            problemId,
          },
        });
      }

      return tx.submission.findUnique({
        where: { id: submission.id },
        include: { testCases: true },
      });
    });

    
const {
  stdin: _stdin,
  stdout: _stdout,
  stderr: _stderr,
  testCases: _allTestCases,
  ...safeSubmission
} = submissionWithTestCases;

const publicTestCases = submissionWithTestCases.testCases
  .filter((result) => {
    const trustedCase = trustedTestCases[result.testCase - 1];
    return trustedCase?.isHidden === false;
  })
  .map((result) => ({
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    status: result.status,
    time: result.time,
    memory: result.memory,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
  }));

return res.status(200).json({
  success: true,
  message: 'Code submitted successfully',
  submission: {
    ...safeSubmission,
    testCases: publicTestCases,
  },
});

  } catch (err) {
    console.error('Error submitting code:', err.message);

    return res.status(err.statusCode || 500).json({
      error:
        err.statusCode === 400 || err.statusCode === 404
          ? err.message
          : 'Failed to submit code',
    });
  }
};
