import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Alert, Spinner, 
  Row, Col, Card, ButtonGroup 
} from 'react-bootstrap';
import apiService from '../services/api';

const DataManager = ({ 
  title, 
  endpoint, 
  fields, 
  displayFields,
  idField = 'id',
  createTitle = 'Add New Record',
  editTitle = 'Edit Record'
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

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
      setError(`Failed to fetch ${title.toLowerCase()}`);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await apiService.delete(endpoint, id);
        setSuccess('Record deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete record');
        console.error('Delete error:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiService.update(endpoint, editingItem[idField], formData);
        setSuccess('Record updated successfully');
      } else {
        await apiService.create(endpoint, formData);
        setSuccess('Record created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(`Failed to ${editingItem ? 'update' : 'create'} record`);
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
            <option value="">Select {label}</option>
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
          <span className="visually-hidden">Loading...</span>
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
              <p className="text-muted">No records found</p>
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
                          Edit
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleDelete(item[idField])}>
                          Delete
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
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DataManager;
