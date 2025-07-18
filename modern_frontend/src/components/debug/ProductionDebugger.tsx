import React, { useEffect, useState } from 'react';

interface DebugInfo {
  environment: string;
  userAgent: string;
  url: string;
  timestamp: string;
  reactVersion: string;
  routerVersion: string;
  errors: Array<{
    message: string;
    stack: string;
    timestamp: string;
  }>;
}

export const ProductionDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in production
    if (process.env.NODE_ENV === 'production' || window.location.hostname.includes('hamciuca.com') || window.location.hostname.includes('netlify.app')) {
      
      // Capture global errors
      const errorHandler = (event: ErrorEvent) => {
        console.error('🚨 ProductionDebugger: Global error captured:', event.error);
        setDebugInfo(prev => ({
          ...prev!,
          errors: [...(prev?.errors || []), {
            message: event.error?.message || event.message,
            stack: event.error?.stack || 'No stack trace',
            timestamp: new Date().toISOString()
          }]
        }));
      };

      // Capture unhandled promise rejections
      const rejectionHandler = (event: PromiseRejectionEvent) => {
        console.error('🚨 ProductionDebugger: Unhandled promise rejection:', event.reason);
        setDebugInfo(prev => ({
          ...prev!,
          errors: [...(prev?.errors || []), {
            message: `Promise rejection: ${event.reason}`,
            stack: event.reason?.stack || 'No stack trace',
            timestamp: new Date().toISOString()
          }]
        }));
      };

      // Initialize debug info
      setDebugInfo({
        environment: process.env.NODE_ENV || 'unknown',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        reactVersion: React.version,
        routerVersion: 'unknown', // We'll try to detect this
        errors: []
      });

      // Add error listeners
      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', rejectionHandler);

      // Show debugger after 3 seconds
      setTimeout(() => setIsVisible(true), 3000);

      return () => {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
      };
    }
  }, []);

  // Only render in production and if visible
  if (!debugInfo || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">🔍 Debug Production</h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="text-xs space-y-1">
          <div><strong>Env:</strong> {debugInfo.environment}</div>
          <div><strong>React:</strong> {debugInfo.reactVersion}</div>
          <div><strong>URL:</strong> {debugInfo.url}</div>
          <div><strong>Errors:</strong> {debugInfo.errors.length}</div>
          
          {debugInfo.errors.length > 0 && (
            <div className="mt-2 p-2 bg-red-700 rounded text-xs">
              <div className="font-bold">Latest Error:</div>
              <div className="break-all">
                {debugInfo.errors[debugInfo.errors.length - 1].message}
              </div>
            </div>
          )}
          
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={() => {
                console.log('🔍 Full Debug Info:', debugInfo);
                alert('Debug info logged to console');
              }}
              className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs"
            >
              Log Details
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
