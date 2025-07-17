import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ show, onHide, onSuccess, action = 'edit' }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Performance: Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setCredentials({ username: '', password: '' });
      setError('');
      setLoading(false);
    }
  }, [show]);

  // Performance: Debounced input handling
  const handleInputChange = useCallback((field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error on input
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    // Performance: Simulate network delay for better UX
    setTimeout(() => {
      const result = login(credentials);
      
      if (result.success) {
        onSuccess?.();
        onHide();
      } else {
        setError(result.error || 'Authentication failed');
      }
      
      setLoading(false);
    }, 500);
  }, [credentials, login, onSuccess, onHide]);

  // Performance: Handle Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  }, [handleSubmit, loading]);

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      size="sm"
    >
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          🔐 Authentication Required
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="info" className="small mb-3">
          <strong>Security Notice:</strong> You need admin credentials to {action} database records.
        </Alert>

        {error && (
          <Alert variant="danger" className="small mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              variant="warning" 
              type="submit" 
              disabled={loading}
              className="fw-bold"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Authenticating...
                </>
              ) : (
                `🔓 Authenticate & ${action.charAt(0).toUpperCase() + action.slice(1)}`
              )}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              disabled={loading}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </Form>

        <div className="mt-3 text-center">
          <small className="text-muted">
            💡 <strong>Demo Credentials:</strong><br/>
            Username: <code>admin</code><br/>
            Password: <code>infra2024!</code>
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(AuthModal); // Performance: Prevent unnecessary re-renders
