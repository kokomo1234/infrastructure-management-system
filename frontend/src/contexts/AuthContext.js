import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

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

  // Performance: Use useCallback to prevent unnecessary re-renders
  const login = useCallback((credentials) => {
    // Secure credential check using environment variables only
    const validCredentials = {
      username: process.env.REACT_APP_ADMIN_USERNAME,
      password: process.env.REACT_APP_ADMIN_PASSWORD
    };

    // Ensure environment variables are set
    if (!validCredentials.username || !validCredentials.password) {
      console.error('❌ Admin credentials not configured. Please set REACT_APP_ADMIN_USERNAME and REACT_APP_ADMIN_PASSWORD in .env file.');
      return { success: false, error: 'Configuration d\'authentification manquante' };
    }

    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      const token = btoa(`${credentials.username}:${Date.now()}`);
      setAuthToken(token);
      setIsAuthenticated(true);
      
      // Performance: Store in sessionStorage (faster than localStorage)
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('authTime', Date.now().toString());
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthToken(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authTime');
  }, []);

  // Performance: Check if session is still valid (30 minutes)
  const checkAuthStatus = useCallback(() => {
    const token = sessionStorage.getItem('authToken');
    const authTime = sessionStorage.getItem('authTime');
    
    if (token && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeDiff < thirtyMinutes) {
        setAuthToken(token);
        setIsAuthenticated(true);
        return true;
      } else {
        // Session expired
        logout();
      }
    }
    return false;
  }, [logout]);

  const value = {
    isAuthenticated,
    authToken,
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
