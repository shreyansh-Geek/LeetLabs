import { useState, useCallback } from 'react';
import { apiFetch } from './utils';

export const useProblems = () => {
  const [problemsState, setProblemsState] = useState({
    problems: [],
    currentProblem: null,
    userSolvedProblems: [],
    isLoading: false,
    error: null,
  });

  // Fetch all problems
  const fetchAllProblems = useCallback(async () => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/problems/getAllProblems', 'GET');
      setProblemsState((prev) => ({
        ...prev,
        problems: response.problems || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch problems',
      }));
      throw error;
    }
  }, []);

  // Fetch a problem by ID
  const fetchProblemById = useCallback(async (id) => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/problems/getProblem/${id}`, 'GET');
      setProblemsState((prev) => ({
        ...prev,
        currentProblem: response.problem || null,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch problem',
      }));
      throw error;
    }
  }, []);

  // Create a new problem (admin only)
  const createProblem = useCallback(async (problemData) => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/problems/createProblem', 'POST', problemData);
      setProblemsState((prev) => ({
        ...prev,
        problems: [...prev.problems, response.problem || problemData],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create problem',
      }));
      throw error;
    }
  }, []);

  // Update a problem by ID (admin only)
  const updateProblemById = useCallback(async (id, problemData) => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/problems/updateProblem/${id}`, 'PUT', problemData);
      setProblemsState((prev) => ({
        ...prev,
        problems: prev.problems.map((problem) =>
          problem.id === id ? { ...problem, ...(response.problem || problemData) } : problem
        ),
        currentProblem:
          prev.currentProblem && prev.currentProblem.id === id
            ? { ...prev.currentProblem, ...(response.problem || problemData) }
            : prev.currentProblem,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update problem',
      }));
      throw error;
    }
  }, []);

  // Delete a problem by ID (admin only)
  const deleteProblemById = useCallback(async (id) => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/problems/deleteProblem/${id}`, 'DELETE');
      setProblemsState((prev) => ({
        ...prev,
        problems: prev.problems.filter((problem) => problem.id !== id),
        currentProblem: prev.currentProblem && prev.currentProblem.id === id ? null : prev.currentProblem,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete problem',
      }));
      throw error;
    }
  }, []);

  // Fetch all problems solved by the user
  const fetchUserSolvedProblems = useCallback(async () => {
    setProblemsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/problems/getAllProblemsSolvedByUser', 'GET');
      setProblemsState((prev) => ({
        ...prev,
        userSolvedProblems: response.problems || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setProblemsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch user solved problems',
      }));
      throw error;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setProblemsState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...problemsState,
    fetchAllProblems,
    fetchProblemById,
    createProblem,
    updateProblemById,
    deleteProblemById,
    fetchUserSolvedProblems,
    clearError,
  };
};