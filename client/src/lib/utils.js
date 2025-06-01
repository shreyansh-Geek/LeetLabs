// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const apiFetch = async (endpoint, method = 'GET', body = null) => {
  const baseUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}` };
      }
      const error = new Error(errorData.message || 'Request failed');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const languageMap = [
  { name: 'JAVASCRIPT', display: 'JavaScript', monaco: 'javascript', judge0: 63 },
  { name: 'PYTHON', display: 'Python', monaco: 'python', judge0: 71 },
  { name: 'JAVA', display: 'Java', monaco: 'java', judge0: 62 },
  { name: 'C++', display: 'C++', monaco: 'cpp', judge0: 54 },
  { name: 'GO', display: 'Go', monaco: 'go', judge0: 60 },
];

export const getCodeStub = (problem, language) => {
  if (!problem || !language) return '// Select a language or problem';
  return (
    problem?.codeSnippets?.[language] ||
    problem?.codeSnippets?.[language.toLowerCase()] ||
    {
      JAVASCRIPT: '// JavaScript code stub',
      PYTHON: '# Python code stub',
      JAVA: '// Java code stub',
      'C++': '// C++ code stub',
      GO: '// Go code stub',
    }[language.toUpperCase()] ||
    '// No code stub available'
  );
};

export const withRetry = async (fn, options = {}) => {
  const { retries = 1, delay = 1000, shouldRetry = () => true } = options; // Reduced default retries to 1
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!shouldRetry(err)) {
        throw err;
      }
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};