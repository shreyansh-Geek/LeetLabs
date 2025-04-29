import { db } from "../utils/db.js";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../utils/judge0.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    editorial,
    tags,
    testcases,
    examples,
    constraints,
    hints,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(401)
      .json({ error: "You are not authorized to create a problem" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = await getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
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
        console.log(`Testcase ${i+1} for language ${language} ------ result ${JSON.stringify(result)} `);
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          editorial,
          tags,
          examples,
          constraints,
          hints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem Created Successfully",
        problem: newProblem,
      });
      
    } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
