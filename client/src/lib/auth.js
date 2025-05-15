import { useState, useEffect } from 'react';
import { apiFetch } from './utils';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiFetch('/auth/check', 'GET');
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', 'POST');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { ...authState, logout };
};