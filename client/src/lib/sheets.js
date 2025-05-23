import { useState, useCallback } from 'react';
import { apiFetch } from '../lib/utils';

export const useSheets = () => {
  const [sheetsState, setSheetsState] = useState({
    publicSheets: [],
    userSheets: [],
    featuredSheets: [],
    currentSheet: null,
    sheetProblems: [],
    isLoading: false,
    error: null,
  });

  // Fetch all public sheets
  const fetchPublicSheets = useCallback(async ({ search = '', page = 1, limit = 15, tags = [] } = {}) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const query = new URLSearchParams({
        search,
        page,
        limit,
        ...(tags.length > 0 && { tags: tags.join(',') }),
      }).toString();
      const response = await apiFetch(`/sheets/public?${query}`, 'GET');
      setSheetsState((prev) => ({
        ...prev,
        publicSheets: response.sheets || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch public sheets',
      }));
      throw error;
    }
  }, []);

  // Fetch user sheets
  const fetchUserSheets = useCallback(async () => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/sheets/user', 'GET');
      setSheetsState((prev) => ({
        ...prev,
        userSheets: response.sheets || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch user sheets',
      }));
      throw error;
    }
  }, []);

  // Fetch featured sheets
  const fetchFeaturedSheets = useCallback(async () => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/sheets/featured', 'GET');
      setSheetsState((prev) => ({
        ...prev,
        featuredSheets: response.sheets || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch featured sheets',
      }));
      throw error;
    }
  }, []);

  // Fetch a sheet by ID
  const fetchSheetById = useCallback(async (id) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}`, 'GET');
      setSheetsState((prev) => ({
        ...prev,
        currentSheet: response.sheet || null,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch sheet',
      }));
      throw error;
    }
  }, []);

  // Fetch problems for a sheet
  const fetchSheetProblems = useCallback(async (id, { page = 1, limit = 20 } = {}) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const query = new URLSearchParams({ page, limit }).toString();
      const response = await apiFetch(`/sheets/${id}/problems?${query}`, 'GET');
      setSheetsState((prev) => ({
        ...prev,
        sheetProblems: response.problems || [],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch sheet problems',
      }));
      throw error;
    }
  }, []);

  // Create a new sheet
  const createSheet = useCallback(async (sheetData) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/sheets/create', 'POST', sheetData);
      setSheetsState((prev) => ({
        ...prev,
        userSheets: [...prev.userSheets, response.sheet || sheetData],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create sheet',
      }));
      throw error;
    }
  }, []);

  // Update a sheet by ID
  const updateSheetById = useCallback(async (id, sheetData) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}/update`, 'PUT', sheetData);
      setSheetsState((prev) => ({
        ...prev,
        userSheets: prev.userSheets.map((sheet) =>
          sheet.id === id ? { ...sheet, ...(response.sheet || sheetData) } : sheet
        ),
        currentSheet:
          prev.currentSheet && prev.currentSheet.id === id
            ? { ...prev.currentSheet, ...(response.sheet || sheetData) }
            : prev.currentSheet,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update sheet',
      }));
      throw error;
    }
  }, []);

  // Delete a sheet by ID
  const deleteSheetById = useCallback(async (id) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}/delete`, 'DELETE');
      setSheetsState((prev) => ({
        ...prev,
        userSheets: prev.userSheets.filter((sheet) => sheet.id !== id),
        currentSheet: prev.currentSheet && prev.currentSheet.id === id ? null : prev.currentSheet,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete sheet',
      }));
      throw error;
    }
  }, []);

  // Clone a sheet
  const cloneSheet = useCallback(async (id) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}/clone`, 'POST');
      setSheetsState((prev) => ({
        ...prev,
        userSheets: [...prev.userSheets, response.sheet || {}],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to clone sheet',
      }));
      throw error;
    }
  }, []);

  // Pin a sheet (admin only)
  const pinSheet = useCallback(async (id, { isRecommended = false } = {}) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}/pin`, 'POST', { isRecommended });
      setSheetsState((prev) => ({
        ...prev,
        featuredSheets: [...prev.featuredSheets, response.sheet || {}],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to pin sheet',
      }));
      throw error;
    }
  }, []);

  // Unpin a sheet (admin only)
  const unpinSheet = useCallback(async (id) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch(`/sheets/${id}/unpin`, 'DELETE');
      setSheetsState((prev) => ({
        ...prev,
        featuredSheets: prev.featuredSheets.filter((sheet) => sheet.id !== id),
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to unpin sheet',
      }));
      throw error;
    }
  }, []);

  // Add a problem to a sheet
  const addProblemToSheet = useCallback(async (sheetId, problemId) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/sheets/add-problem', 'POST', { sheetId, problemId });
      setSheetsState((prev) => ({
        ...prev,
        userSheets: prev.userSheets.map((sheet) =>
          sheet.id === sheetId
            ? {
                ...sheet,
                problems: [...(sheet.problems || []), problemId],
                totalProblems: (sheet.totalProblems || 0) + 1,
              }
            : sheet
        ),
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to add problem to sheet',
      }));
      throw error;
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setSheetsState((prev) => ({ ...prev, error: null }));
  }, []);

  // Remove a problem from a sheet
  const removeProblemFromSheet = useCallback(async (sheetId, problemId) => {
    setSheetsState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiFetch('/sheets/remove-problem', 'DELETE', { sheetId, problemId });
      setSheetsState((prev) => ({
        ...prev,
        sheetProblems: prev.sheetProblems.filter((problem) => problem.id !== problemId),
        userSheets: prev.userSheets.map((sheet) =>
          sheet.id === sheetId
            ? {
                ...sheet,
                problems: sheet.problems.filter((id) => id !== problemId),
                totalProblems: sheet.totalProblems - 1,
              }
            : sheet
        ),
        currentSheet:
          prev.currentSheet && prev.currentSheet.id === sheetId
            ? {
                ...prev.currentSheet,
                problems: prev.currentSheet.problems.filter((id) => id !== problemId),
                progress: {
                  ...prev.currentSheet.progress,
                  total: prev.currentSheet.progress.total - 1,
                  percentage:
                    prev.currentSheet.progress.total - 1 > 0
                      ? (prev.currentSheet.progress.solved / (prev.currentSheet.progress.total - 1)) * 100
                      : 0,
                },
              }
            : prev.currentSheet,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      setSheetsState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to remove problem from sheet',
      }));
      throw error;
    }
  }, []);

  return {
    ...sheetsState,
    fetchPublicSheets,
    fetchUserSheets,
    fetchFeaturedSheets,
    fetchSheetById,
    fetchSheetProblems,
    createSheet,
    updateSheetById,
    deleteSheetById,
    cloneSheet,
    pinSheet,
    unpinSheet,
    addProblemToSheet,
    removeProblemFromSheet,
    clearError,
  };
};
