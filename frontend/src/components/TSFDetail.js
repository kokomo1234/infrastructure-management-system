import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Alert, Spinner, 
  Badge, Table 
} from 'react-bootstrap';
import apiService from '../services/api';

const TSFDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tsf, setTsf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Performance: Memoized fetch function
  const fetchTSFDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getById('tsf', id);
      setTsf(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch TSF details');
      console.error('Error fetching TSF:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTSFDetail();
  }, [fetchTSFDetail]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="info" size="lg" />
          <h4 className="mt-3">Loading TSF Details...</h4>
        </div>
      </Container>
    );
  }

  if (error || !tsf) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading TSF</Alert.Heading>
          <p>{error || 'TSF not found'}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={fetchTSFDetail}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/locations/tsf')}>
              Back to TSF List
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">🔧 TSF Facility {tsf.id}</h1>
              <p className="text-muted mb-0">Technical Service Facility - {tsf.region}</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/locations/tsf')}
              >
                ← Back to List
              </Button>
              <Button 
                variant="info" 
                onClick={() => navigate('/tsf')}
              >
                Manage TSF
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Main Info Card */}
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">📋 Facility Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Facility ID:</td>
                        <td>{tsf.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Region:</td>
                        <td>
                          <Badge bg="info">{tsf.region}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Service Type:</td>
                        <td>{tsf.type_service || 'Technical Service'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Capacity:</td>
                        <td>{tsf.capacite || 'Standard'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge bg="success">Active</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Address:</td>
                        <td>{tsf.adresse || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">City:</td>
                        <td>{tsf.ville || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Postal Code:</td>
                        <td>{tsf.code_postal || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Priority:</td>
                        <td>
                          <Badge bg="warning">High</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Last Updated:</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Service Details */}
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">🛠️ Service Details</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="text-muted">Service Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="primary">Maintenance</Badge>
                  <Badge bg="success">Installation</Badge>
                  <Badge bg="info">Support</Badge>
                  <Badge bg="warning">Emergency</Badge>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted">Operating Hours</h6>
                <p className="mb-1"><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p className="mb-1"><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                <p className="mb-0"><strong>Sunday:</strong> Emergency Only</p>
              </div>

              <div className="mb-4">
                <h6 className="text-muted">Contact Information</h6>
                <p className="mb-1">📞 <strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="mb-1">📧 <strong>Email:</strong> tsf{tsf.id}@infrastructure.com</p>
                <p className="mb-0">🌐 <strong>Region:</strong> {tsf.region}</p>
              </div>

              <div className="text-center">
                <Button variant="outline-info" size="sm" className="w-100">
                  📞 Contact Facility
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Info Row */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-light">
              <h6 className="mb-0">📈 Performance Metrics</h6>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-success mb-0">98%</div>
                  <small className="text-muted">Uptime</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-info mb-0">24</div>
                  <small className="text-muted">Avg Response (min)</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-warning mb-0">156</div>
                  <small className="text-muted">Services/Month</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-light">
              <h6 className="mb-0">🔧 Equipment Status</h6>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-success mb-0">12</div>
                  <small className="text-muted">Operational</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-warning mb-0">2</div>
                  <small className="text-muted">Maintenance</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-danger mb-0">0</div>
                  <small className="text-muted">Out of Service</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(TSFDetail); // Performance: Prevent unnecessary re-renders
