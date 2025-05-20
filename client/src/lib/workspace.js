// lib/workspace.js
import { useState, useCallback } from 'react';
import { apiFetch, languageMap } from './utils';

export const useWorkspace = () => {
  const [workspaceState, setWorkspaceState] = useState({
    submissions: [],
    notes: '',
    output: [],
    isLoading: false,
    isRunning: false,
    isSubmitting: false,
    error: null,
  });

  // Fetch user submissions for a problem
  const fetchSubmissionsForProblem = useCallback(async (problemId) => {
    setWorkspaceState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/submissions/get-user-submissions-for-problem/${problemId}`, 'GET');
      setWorkspaceState((prev) => ({
        ...prev,
        submissions: response.submissions || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.warn(`fetchSubmissionsForProblem warning for problemId ${problemId}:`, error);
      setWorkspaceState((prev) => ({
        ...prev,
        submissions: [], // Default to empty array for 404
        isLoading: false,
        error: error.status === 404 ? null : error.message || 'Failed to fetch submissions',
      }));
      throw error;
    }
  }, []);

  // Fetch notes for a problem
  const fetchNotes = useCallback(async (problemId) => {
  setWorkspaceState((prev) => ({ ...prev, isLoading: true, error: null }));
  try {
    const response = await apiFetch(`/notes/${problemId}`, 'GET');
    console.log('fetchNotes response:', response);
    const noteContent = response.note ?? '';
    setWorkspaceState((prev) => ({
      ...prev,
      notes: noteContent,
      isLoading: false,
    }));
    return response;
  } catch (error) {
    console.error(`fetchNotes error for problemId ${problemId}:`, error);
    setWorkspaceState((prev) => ({
      ...prev,
      notes: '',
      isLoading: false,
      error: error.message || 'Failed to fetch notes',
    }));
    return { note: '' }; // Return a fallback response
  }
}, []);

  // Save notes for a problem
  const saveNotes = useCallback(async (problemId, content) => {
    setWorkspaceState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/notes/save/${problemId}`, 'POST', { content });
      setWorkspaceState((prev) => ({
        ...prev,
        notes: content,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.error(`saveNotes error for problemId ${problemId}:`, error);
      setWorkspaceState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to save notes',
      }));
      throw error;
    }
  }, []);

  // Run code
  const runCode = useCallback(async (problem, code, language, customTestCases) => {
    setWorkspaceState((prev) => ({ ...prev, isRunning: true, error: null }));
    try {
      const testCases = [...(problem?.testcases?.filter(tc => !tc.isHidden) || []), ...customTestCases];
      const response = await apiFetch('/execute-code/run', 'POST', {
        source_code: code,
        language_id: languageMap.find(l => l.name === language).judge0,
        stdin: testCases.map(tc => tc.input),
        expected_outputs: testCases.map(tc => tc.output),
      });
      setWorkspaceState((prev) => ({
        ...prev,
        output: response.testCases || [],
        isRunning: false,
      }));
      return response;
    } catch (error) {
      console.error('runCode error:', error);
      setWorkspaceState((prev) => ({
        ...prev,
        isRunning: false,
        error: error.message || 'Failed to run code',
      }));
      throw error;
    }
  }, []);

  // Submit code
  const submitCode = useCallback(async (problem, code, language, problemId) => {
    setWorkspaceState((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const response = await apiFetch('/execute-code/submit', 'POST', {
        source_code: code,
        language_id: languageMap.find(l => l.name === language).judge0,
        stdin: problem?.testcases?.map(tc => tc.input) || [],
        expected_outputs: problem?.testcases?.map(tc => tc.output) || [],
        problemId,
      });
      setWorkspaceState((prev) => ({
        ...prev,
        submissions: [response.submission, ...prev.submissions],
        output: response.submission.testCases || [],
        isSubmitting: false,
      }));
      return response;
    } catch (error) {
      console.error('submitCode error:', error);
      setWorkspaceState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message || 'Failed to submit code',
      }));
      throw error;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setWorkspaceState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...workspaceState,
    fetchSubmissionsForProblem,
    fetchNotes,
    saveNotes,
    runCode,
    submitCode,
    clearError,
  };
};