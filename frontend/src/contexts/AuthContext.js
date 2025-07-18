import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

// API Base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://infrastructure-management-system-production.up.railway.app/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // JWT Authentication login
  const login = useCallback(async (credentials) => {
    try {
      console.log('🔐 Attempting login with JWT authentication...');
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email || credentials.username,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur de connexion' }));
        console.error('❌ Login failed:', errorData);
        return { success: false, error: errorData.message || 'Erreur de connexion' };
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);
      
      // Store JWT token and user data
      setAuthToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }, []);

  // JWT Authentication logout
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if token exists
      if (authToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }).catch(() => {}); // Ignore errors on logout
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setIsAuthenticated(false);
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🚪 User logged out');
    }
  }, [authToken]);

  // Check authentication status on app load
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        setLoading(false);
        return false;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        setAuthToken(token);
        setUser(profileData.user);
        setIsAuthenticated(true);
        console.log('✅ Authentication restored:', profileData.user);
        setLoading(false);
        return true;
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setLoading(false);
      return false;
    }
  }, []);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    isAuthenticated,
    authToken,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
