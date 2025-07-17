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
      setError('Veuillez saisir le nom d\'utilisateur et le mot de passe');
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
        setError(result.error || 'Échec de l\'authentification');
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
          🔐 Authentification Requise
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant="info" className="small mb-3">
          <strong>Avis de Sécurité :</strong> Vous avez besoin des identifiants administrateur pour {action === 'edit' ? 'modifier' : action === 'delete' ? 'supprimer' : action === 'create' ? 'créer' : action} les enregistrements de la base de données.
        </Alert>

        {error && (
          <Alert variant="danger" className="small mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Saisir le nom d'utilisateur"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Saisir le mot de passe"
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
                  Authentification...
                </>
              ) : (
                `🔓 Authentifier & ${action === 'edit' ? 'Modifier' : action === 'delete' ? 'Supprimer' : action === 'create' ? 'Créer' : action.charAt(0).toUpperCase() + action.slice(1)}`
              )}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              disabled={loading}
              size="sm"
            >
              Annuler
            </Button>
          </div>
        </Form>

        <div className="mt-3 text-center">
          <small className="text-muted">
            🔒 <strong>Accès Sécurisé :</strong><br/>
            Contactez l'administrateur pour obtenir les identifiants d'accès.
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(AuthModal); // Performance: Prevent unnecessary re-renders
