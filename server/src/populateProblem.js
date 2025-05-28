import fs from 'fs/promises';
import { db } from '../src/utils/db.js';
import { getJudge0LanguageId, submitBatch, pollBatchResults } from '../src/utils/judge0.js';

// Replace with your valid User ID
const DEFAULT_USER_ID = '63b849b2-1d91-49f4-bdfe-6f7b7010d3d6';


async function validateTestCases(problem, referenceSolutions, testcases) {
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = await getJudge0LanguageId(language);
      if (!languageId) {
        throw new Error(`Language ${language} is not supported for ${problem.title}`);
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((result) => result.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(
          `Testcase ${i + 1} for ${language} in ${problem.title} ------ result ${JSON.stringify(result)}`
        );
        if (result.status.id !== 3) { // 3 = Accepted
          throw new Error(
            `Testcase ${i + 1} failed for ${language} in ${problem.title}: ${result.status.description}`
          );
        }
      }
    }
    return true;
  } catch (error) {
    console.error(`Validation failed for ${problem.title}:`, error.message);
    return false;
  }
}

async function populateProblemsDirect() {
  try {
    // Read JSON file
    const problemsData = await fs.readFile('problems.json', 'utf8');
    const problems = JSON.parse(problemsData);

    console.log(`Processing ${problems.length} problems...`);

    const problemDataList = [];

    for (const problem of problems) {
      console.log(`Processing problem: ${problem.title}`);

      // Map constraints array to string
      const constraintsString = Array.isArray(problem.constraints)
        ? problem.constraints.join('\n')
        : problem.constraints || '';

      // Map hints array to string
      const hintsString = Array.isArray(problem.hints)
        ? problem.hints.join('\n')
        : problem.hints || null;


      // Prepare data for insertion
      const problemData = {
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty, // Assumes EASY, MEDIUM, HARD
        tags: Array.isArray(problem.tags) ? problem.tags : [],
        userId: DEFAULT_USER_ID,
        examples: problem.examples.map(ex => ({
          input: String(ex.input),
          output: String(ex.output),
          explanation: ex.explanation || '',
        })),
        constraints: constraintsString,
        hints: hintsString,
        editorial: problem.editorial || '',
        testcases: problem.testcases.map(tc => ({
          id: tc.id,
          input: String(tc.input),
          output: String(tc.output),
          isHidden: Boolean(tc.isHidden),
          explanation: tc.explanation || '',
        })),
        codeSnippets: {
          JAVASCRIPT: problem.codeSnippets.JAVASCRIPT || '',
          PYTHON: problem.codeSnippets.PYTHON || '',
          JAVA: problem.codeSnippets.JAVA || '',
          'C++': problem.codeSnippets['C++'] || '',
          GO: problem.codeSnippets.GO || '',
        },
        referenceSolutions: {
          JAVASCRIPT: problem.referenceSolutions.JAVASCRIPT || '',
          PYTHON: problem.referenceSolutions.PYTHON || '',
          JAVA: problem.referenceSolutions.JAVA || '',
          'C++': problem.referenceSolutions['C++'] || '',
          GO: problem.referenceSolutions.GO || '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Validate test cases with Judge0
      const isValid = await validateTestCases(
        problem,
        problemData.referenceSolutions,
        problemData.testcases
      );
      if (!isValid) {
        console.error(`Skipping ${problem.title} due to test case validation failure`);
        continue;
      }

      problemDataList.push(problemData);
    }

    // Batch insert problems
    if (problemDataList.length > 0) {
      await db.$transaction(
        problemDataList.map(data =>
          db.problem.create({
            data,
          })
        )
      );
      console.log(`Inserted ${problemDataList.length} problems successfully.`);
    } else {
      console.warn('No problems inserted due to validation failures.');
    }

    console.log('All valid problems processed successfully.');
  } catch (error) {
    console.error('Error in populateProblemsDirect:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await db.$disconnect();
    console.log('Database connection closed.');
  }
}

populateProblemsDirect();