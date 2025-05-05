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

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({ error: "Problems not found." });
    }

    return res.status(200).json({
      success: true,
      message: "All Problems Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem",
    });
  }
};

export const updateProblemById = async (req, res) => {
  const { id } = req.params;
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
      .json({ error: "You are not authorized to update a problem" });
  }

  try {
    if (referenceSolutions && testcases) {
      for (const [language, solutionCode] of Object.entries(
        referenceSolutions
      )) {
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
          console.log(
            `Testcase ${
              i + 1
            } for language ${language} ------ result ${JSON.stringify(result)} `
          );
          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `Testcase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(difficulty && { difficulty }),
      ...(editorial && { editorial }),
      ...(tags && { tags }),
      ...(testcases && { testcases }),
      ...(examples && { examples }),
      ...(constraints && { constraints }),
      ...(hints && { hints }),
      ...(codeSnippets && { codeSnippets }),
      ...(referenceSolutions && { referenceSolutions }),
    };

    const updatedProblem = await db.problem.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Problem Updated Successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Updating Problem",
    });
  }
};

export const deleteProblemById = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== "ADMIN") {
    return res.status(401).json({ error: "You are not authorized to delete a problem" });
  }

  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    await db.problem.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Problem Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Deleting Problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include:{
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        }
      }
    })
    return res.status(200).json({
      success: true,
      message: "All Problems Solved By User Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};
