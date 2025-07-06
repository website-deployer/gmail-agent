import { useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import { googleAuthService } from '../services/googleAuthService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize Google OAuth service
        await googleAuthService.initialize();
        
        // Check for existing token in localStorage
        const token = localStorage.getItem('gmail_token');
        const userStr = localStorage.getItem('gmail_user');
        
        if (token && userStr && googleAuthService.isTokenValid(token)) {
          try {
            const user = JSON.parse(userStr) as User;
            setAuthState({
              isAuthenticated: true,
              user,
              token,
              loading: false,
              error: null,
            });
          } catch (error) {
            localStorage.removeItem('gmail_token');
            localStorage.removeItem('gmail_user');
            setAuthState((prev: AuthState) => ({ ...prev, loading: false }));
          }
        } else {
          setAuthState((prev: AuthState) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
        setAuthState((prev: AuthState) => ({ ...prev, loading: false, error: 'Failed to initialize authentication' }));
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    setAuthState((prev: AuthState) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { user, token } = await googleAuthService.login();
      
      localStorage.setItem('gmail_token', token);
      localStorage.setItem('gmail_user', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to authenticate with Gmail',
      }));
    }
  };

  const logout = async () => {
    try {
      await googleAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};