// lib/profile.js
import { useState, useCallback } from 'react';
import { apiFetch } from './utils';

export const useProfile = () => {
  const [profileState, setProfileState] = useState({
    allSubmissions: [],
    streakData: { current: 0, longest: 0 },
    performanceMetrics: { successRate: '0.0', averageTime: '0:00', ranking: 0, percentile: '0.0' },
    problemsSolvedCount: 0,
    difficultyStats: { easy: 0, medium: 0, hard: 0 },
    skillsData: [],
    isLoading: false,
    error: null,
    fetchCount: 0, // Track concurrent fetches
  });

  const startLoading = useCallback(() => {
    setProfileState((prev) => ({ ...prev, isLoading: true, fetchCount: prev.fetchCount + 1, error: null }));
  }, []);

  const endLoading = useCallback(() => {
    setProfileState((prev) => {
      const newCount = prev.fetchCount - 1;
      return { ...prev, fetchCount: newCount, isLoading: newCount > 0 };
    });
  }, []);

  const fetchAllUserSubmissions = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/submissions/get-all-user-submissions', 'GET');
      // Normalize submission data
      const normalizedSubmissions = response.data.map((sub) => ({
        ...sub,
        problemTitle: sub.problem?.title || 'Unknown Problem',
        submittedAt: sub.createdAt, // Map createdAt to submittedAt
        runtime: sub.time, // Map time to runtime
      }));
      setProfileState((prev) => ({
        ...prev,
        allSubmissions: normalizedSubmissions,
      }));
      return response;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch user submissions',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const fetchStreakData = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/submissions/get-streak-data', 'GET');
      setProfileState((prev) => ({
        ...prev,
        streakData: response.streak || { current: 0, longest: 0 },
      }));
      return response;
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch streak data',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const fetchPerformanceMetrics = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/submissions/get-performance-metrics', 'GET');
      setProfileState((prev) => ({
        ...prev,
        performanceMetrics: response.metrics || {
          successRate: '0.0',
          averageTime: '0:00',
          ranking: 0,
          percentile: '0.0',
        },
      }));
      return response;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch performance metrics',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const fetchUserSolvedProblemsCount = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/problems/get-user-solved-count', 'GET');
      setProfileState((prev) => ({
        ...prev,
        problemsSolvedCount: response.count || 0,
      }));
      return response;
    } catch (error) {
      console.error('Error fetching solved problems count:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch solved problems count',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const fetchDifficultyStats = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/problems/get-difficulty-stats', 'GET');
      setProfileState((prev) => ({
        ...prev,
        difficultyStats: response.stats || { easy: 0, medium: 0, hard: 0 },
      }));
      return response;
    } catch (error) {
      console.error('Error fetching difficulty stats:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch difficulty stats',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const fetchSkillsData = useCallback(async () => {
    startLoading();
    try {
      const response = await apiFetch('/problems/get-skills-data', 'GET');
      setProfileState((prev) => ({
        ...prev,
        skillsData: response.skills || [],
      }));
      return response;
    } catch (error) {
      console.error('Error fetching skills data:', error);
      setProfileState((prev) => ({
        ...prev,
        error: error.message || 'Failed to fetch skills data',
      }));
      throw error;
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const clearError = useCallback(() => {
    setProfileState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...profileState,
    fetchAllUserSubmissions,
    fetchStreakData,
    fetchPerformanceMetrics,
    fetchUserSolvedProblemsCount,
    fetchDifficultyStats,
    fetchSkillsData,
    clearError,
  };
};