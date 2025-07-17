import React from 'react';
import { Badge } from 'react-bootstrap';

const BuildInfo = () => {
  // Performance: Generate build date at build time
  const buildDate = process.env.REACT_APP_BUILD_DATE || new Date().toISOString();
  const buildVersion = process.env.REACT_APP_VERSION || '1.0.0';
  
  // Performance: Format date efficiently
  const formatBuildDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Badge 
        bg="secondary" 
        className="text-light small"
        title={`Build Version: ${buildVersion}\nBuild Time: ${formatBuildDate(buildDate)}`}
      >
        🚀 v{buildVersion}
      </Badge>
      <Badge 
        bg="outline-light" 
        text="light"
        className="small border-light"
        title={`Last deployed: ${formatBuildDate(buildDate)}`}
      >
        📅 {formatBuildDate(buildDate)}
      </Badge>
    </div>
  );
};

export default React.memo(BuildInfo); // Performance: Prevent unnecessary re-renders
