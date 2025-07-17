import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, TokenManager, User, LoginRequest } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!TokenManager.getToken();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      console.log('🔍 AuthContext: Starting authentication check...');
      try {
        const token = TokenManager.getToken();
        console.log('🔑 AuthContext: Token check:', token ? 'Token found' : 'No token');
        
        if (token && !TokenManager.isTokenExpired(token)) {
          console.log('✅ AuthContext: Token is valid, fetching user...');
          try {
            // Get current user from API
            const currentUser = await apiService.getCurrentUser();
            console.log('👤 AuthContext: User fetched successfully:', currentUser.email);
            setUser(currentUser);
          } catch (apiError) {
            console.error('🚨 AuthContext: API call failed, backend might not be configured:', apiError);
            // If API call fails, clear tokens and continue without crashing
            TokenManager.clearTokens();
            setUser(null);
          }
        } else {
          console.log('❌ AuthContext: Token expired or invalid, clearing tokens');
          // Clear expired or invalid tokens
          TokenManager.clearTokens();
          setUser(null);
        }
      } catch (error) {
        console.error('💥 AuthContext: Auth check failed:', error);
        TokenManager.clearTokens();
        setUser(null);
      } finally {
        console.log('🏁 AuthContext: Authentication check complete');
        setIsLoading(false);
      }
    };

    // Add error handling for the entire effect
    checkAuth().catch((error) => {
      console.error('🚨 AuthContext: Critical error in auth check:', error);
      setIsLoading(false);
      setUser(null);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 AuthContext: Starting login process for:', email);
    try {
      setIsLoading(true);
      
      const credentials: LoginRequest = { email, password };
      console.log('📤 AuthContext: Sending login request...');
      const response = await apiService.login(credentials);
      
      console.log('✅ AuthContext: Login successful for user:', response.user.email);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('💥 AuthContext: Login failed:', error);
      TokenManager.clearTokens();
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      console.log('🏁 AuthContext: Login process complete');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
