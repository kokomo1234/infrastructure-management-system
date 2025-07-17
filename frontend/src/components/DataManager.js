import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Alert, Spinner, 
  Row, Col, Card, ButtonGroup 
} from 'react-bootstrap';
import apiService from '../services/api';
import AuthModal from './AuthModal';
import { useProtectedAction } from '../hooks/useProtectedAction';

const DataManager = ({ 
  title, 
  endpoint, 
  fields, 
  displayFields,
  idField = 'id',
  createTitle = 'Ajouter un Nouvel Enregistrement',
  editTitle = 'Modifier l\'Enregistrement'
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Security: Protected actions hook
  const {
    showAuthModal,
    pendingAction,
    executeProtectedAction,
    handleAuthSuccess,
    handleAuthClose
  } = useProtectedAction();

  useEffect(() => {
    fetchData();
  }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAll(endpoint);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(`Échec du chargement de ${title.toLowerCase()}`);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Security: Protected create action
  const handleCreate = () => {
    executeProtectedAction(() => {
      setEditingItem(null);
      setFormData({});
      setShowModal(true);
    }, 'create');
  };

  // Security: Protected edit action
  const handleEdit = (item) => {
    executeProtectedAction(() => {
      setEditingItem(item);
      setFormData({ ...item });
      setShowModal(true);
    }, 'edit');
  };

  // Security: Protected delete action
  const handleDelete = (id) => {
    executeProtectedAction(async () => {
      if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet enregistrement ? Cette action ne peut pas être annulée.')) {
        try {
          await apiService.delete(endpoint, id);
          setSuccess('🗑️ Enregistrement supprimé avec succès');
          fetchData();
        } catch (err) {
          setError('❌ Échec de la suppression de l\'enregistrement');
          console.error('Delete error:', err);
        }
      }
    }, 'delete');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiService.update(endpoint, editingItem[idField], formData);
        setSuccess('Enregistrement mis à jour avec succès');
      } else {
        await apiService.create(endpoint, formData);
        setSuccess('Enregistrement créé avec succès');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(`Échec de ${editingItem ? 'la mise à jour' : 'la création'} de l'enregistrement`);
      console.error('Submit error:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderFormField = (field) => {
    const { name, label, type = 'text', required = false, options } = field;
    
    if (type === 'select' && options) {
      return (
        <Form.Group className="mb-3" key={name}>
          <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
          <Form.Select
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            required={required}
          >
            <option value="">Sélectionner {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      );
    }

    if (type === 'checkbox') {
      return (
        <Form.Group className="mb-3" key={name}>
          <Form.Check
            type="checkbox"
            label={label}
            checked={formData[name] || false}
            onChange={(e) => handleInputChange(name, e.target.checked)}
          />
        </Form.Group>
      );
    }

    return (
      <Form.Group className="mb-3" key={name}>
        <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
          type={type}
          value={formData[name] || ''}
          onChange={(e) => handleInputChange(name, e.target.value)}
          required={required}
        />
      </Form.Group>
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>{title}</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleCreate}>
            {createTitle}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

      <Card>
        <Card.Body>
          {data.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Aucun enregistrement trouvé</p>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  {displayFields.map(field => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item[idField]}>
                    {displayFields.map(field => (
                      <td key={field.key}>
                        {field.render ? field.render(item[field.key], item) : item[field.key]}
                      </td>
                    ))}
                    <td>
                      <ButtonGroup size="sm">
                        <Button variant="outline-primary" onClick={() => handleEdit(item)}>
                          Modifier
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleDelete(item[idField])}>
                          Supprimer
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? editTitle : createTitle}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {fields.map(field => (
                <Col md={field.colSize || 12} key={field.name}>
                  {renderFormField(field)}
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Security: Authentication Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={handleAuthClose}
        onSuccess={handleAuthSuccess}
        action={pendingAction?.actionType || 'edit'}
      />
    </div>
  );
};

export default DataManager;
