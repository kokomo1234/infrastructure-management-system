import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error('🚨 AdvancedErrorBoundary: Error caught:', error);
    
    // Send error details to console for production debugging
    console.group('🔍 Production Error Analysis');
    console.error('Error ID:', errorId);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Error Name:', error.name);
    console.error('Timestamp:', new Date().toISOString());
    console.error('URL:', window.location.href);
    console.error('User Agent:', navigator.userAgent);
    console.groupEnd();

    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 AdvancedErrorBoundary: Component stack trace:', errorInfo.componentStack);
    
    // Enhanced error logging for production debugging
    console.group('🔍 Component Error Details');
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Boundary Props:', this.props);
    console.error('React Version:', React.version);
    
    // Try to identify the problematic component
    const componentStack = errorInfo.componentStack;
    const firstComponent = componentStack.split('\n')[1]?.trim();
    console.error('Likely Problematic Component:', firstComponent);
    
    // Check for common error patterns
    if (error.message.includes('Cannot read properties of undefined')) {
      console.error('🔍 Likely cause: Undefined property access');
    }
    if (error.message.includes('Cannot read properties of null')) {
      console.error('🔍 Likely cause: Null reference error');
    }
    if (error.message.includes('is not a function')) {
      console.error('🔍 Likely cause: Function call on non-function value');
    }
    if (error.stack?.includes('Router') || error.stack?.includes('navigate')) {
      console.error('🔍 Likely cause: React Router related error');
    }
    
    console.groupEnd();

    this.setState({
      errorInfo,
      error
    });

    // In production, try to report the error
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Create a detailed error report
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      reactVersion: React.version
    };

    // Log to console for debugging
    console.error('📊 Error Report:', errorReport);

    // Store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('production_errors') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('production_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Failed to store error report:', e);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for production debugging
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Erreur de l'application détectée
                </h3>
                <p className="text-sm text-gray-500">
                  ID d'erreur: {this.state.errorId}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Une erreur inattendue s'est produite. Les détails techniques ont été enregistrés pour le débogage.
              </p>
              
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <h4 className="font-medium text-red-800 mb-2">Message d'erreur:</h4>
                  <p className="text-sm text-red-700 font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Rafraîchir la page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => {
                  const errors = localStorage.getItem('production_errors');
                  if (errors) {
                    console.log('🔍 All Production Errors:', JSON.parse(errors));
                    alert('Erreurs de production enregistrées dans la console');
                  }
                }}
                className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Voir les erreurs
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
