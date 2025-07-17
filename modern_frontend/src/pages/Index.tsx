import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (!isLoading) {
      if (isAuthenticated) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // This will be replaced by the useEffect redirect
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
