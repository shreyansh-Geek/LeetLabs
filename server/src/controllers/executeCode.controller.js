import { db } from '../utils/db.js';
import {
  getJudge0LanguageName,
  submitBatch,
  pollBatchResults,
} from '../utils/judge0.js';

// Shared logic: run code and return detailed results
const evaluateCode = async ({ source_code, language_id, stdin, expected_outputs }) => {
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new Error('Invalid or missing test cases');
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((result) => result.token);
  const results = await pollBatchResults(tokens);

  let allPassed = true;
  const detailedResults = results.map((result, index) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[index].trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: index + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  return { detailedResults, allPassed };
};

// ---------------------------------
// 1. Run Code (No DB operations)
// ---------------------------------
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
    res.status(400).json({ error: err.message });
  }
};

// ---------------------------------
// 2. Submit Code (DB operations)
// ---------------------------------
export const submitCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
  const userId = req.user.id;

  try {
    const { detailedResults, allPassed } = await evaluateCode({
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    const languageName = await getJudge0LanguageName(language_id);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: languageName,
        stdin: stdin.join('\n'),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr) ? JSON.stringify(detailedResults.map((r) => r.stderr)) : null,
        compileOutput: detailedResults.some((r) => r.compileOutput) ? JSON.stringify(detailedResults.map((r) => r.compileOutput)) : null,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        memory: detailedResults.some((r) => r.memory) ? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
        time: detailedResults.some((r) => r.time) ? JSON.stringify(detailedResults.map((r) => r.time)) : null,
      },
    });

    // Mark problem as solved if all passed
    if (allPassed) {
      await db.problemSolved.upsert({
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

    // Save individual test case results
    const testCaseResults = detailedResults.map((result) => ({
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
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    const submissionWithTestCases = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    res.status(200).json({
      success: true,
      message: 'Code submitted successfully',
      submission: submissionWithTestCases,
    });
  } catch (err) {
    console.error('Error submitting code:', err.message);
    res.status(500).json({ error: 'Failed to submit code' });
  }
};
