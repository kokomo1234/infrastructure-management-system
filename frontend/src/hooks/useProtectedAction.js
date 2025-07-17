import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useProtectedAction = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { isAuthenticated, checkAuthStatus } = useAuth();

  // Performance: Execute protected action with auth check
  const executeProtectedAction = useCallback((action, actionType = 'edit') => {
    // Check if already authenticated and session is valid
    if (isAuthenticated || checkAuthStatus()) {
      // Execute action immediately
      action();
      return;
    }

    // Store the action to execute after authentication
    setPendingAction({ action, actionType });
    setShowAuthModal(true);
  }, [isAuthenticated, checkAuthStatus]);

  // Performance: Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    if (pendingAction) {
      // Execute the pending action
      pendingAction.action();
      setPendingAction(null);
    }
    setShowAuthModal(false);
  }, [pendingAction]);

  // Performance: Handle auth modal close
  const handleAuthClose = useCallback(() => {
    setShowAuthModal(false);
    setPendingAction(null);
  }, []);

  return {
    showAuthModal,
    pendingAction,
    executeProtectedAction,
    handleAuthSuccess,
    handleAuthClose
  };
};
