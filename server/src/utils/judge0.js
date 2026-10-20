
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.JUDGE0_BASE_URL;

if (!BASE_URL) {
  throw new Error("JUDGE0_BASE_URL is not configured");
}

const judge0 = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Cache the Judge0 language list for five minutes.
let cachedLanguages = null;
let languagesFetchedAt = 0;

const LANGUAGE_CACHE_TTL = 5 * 60 * 1000;

const getLanguages = async () => {
  const now = Date.now();

  if (
    cachedLanguages &&
    now - languagesFetchedAt < LANGUAGE_CACHE_TTL
  ) {
    return cachedLanguages;
  }

  const { data } = await judge0.get("/languages", {
    params: { base64_encoded: "false" },
  });

  if (!Array.isArray(data)) {
    throw new Error("Invalid language list returned by Judge0");
  }

  cachedLanguages = data;
  languagesFetchedAt = now;

  return cachedLanguages;
};

export const getJudge0LanguageId = async (language) => {
  try {
    const languages = await getLanguages();
    const requested = String(language).toLowerCase().trim();

    const match = languages.find((item) =>
      item.name.toLowerCase().includes(requested)
    );

    if (!match) {
      throw new Error(`Language ${language} not found in Judge0`);
    }

    return match.id;
  } catch (error) {
    console.error("Error getting Judge0 language ID:", error.message);
    return null;
  }
};

export const getJudge0LanguageName = async (languageId) => {
  try {
    const languages = await getLanguages();

    const match = languages.find(
      (item) => Number(item.id) === Number(languageId)
    );

    if (!match) {
      throw new Error(`Language ID ${languageId} not found in Judge0`);
    }

    return match.name;
  } catch (error) {
    console.error("Error getting Judge0 language name:", error.message);
    return null;
  }
};

export const submitBatch = async (submissions) => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    throw new Error("At least one submission is required");
  }

  const { data } = await judge0.post(
    "/submissions/batch",
    { submissions },
    {
      params: { base64_encoded: "false" },
    }
  );

  if (
    !Array.isArray(data) ||
    data.length !== submissions.length ||
    data.some((item) => !item.token)
  ) {
    throw new Error("Judge0 returned invalid submission tokens");
  }

  return data;
};

export const pollBatchResults = async (
  tokens,
  { maxAttempts = 30, intervalMs = 1000 } = {}
) => {
  if (
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    tokens.some((token) => typeof token !== "string" || !token)
  ) {
    throw new Error("Valid Judge0 submission tokens are required");
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data } = await judge0.get("/submissions/batch", {
      params: {
        tokens: tokens.join(","),
        base64_encoded: "false",
      },
    });

    const results = data?.submissions;

    if (!Array.isArray(results) || results.length !== tokens.length) {
      throw new Error("Judge0 returned incomplete batch results");
    }

    const allFinished = results.every((result) => {
      const statusId = result.status?.id;
      return statusId !== 1 && statusId !== 2;
    });

    if (allFinished) {
      return results;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  throw new Error(
    `Judge0 execution timed out after ${maxAttempts} polling attempts`
  );
};
