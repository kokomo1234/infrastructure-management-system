import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Button, Alert, Spinner, 
  Badge, Table, ProgressBar 
} from 'react-bootstrap';
import apiService from '../services/api';

const TDLDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tdl, setTdl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Performance: Memoized fetch function
  const fetchTDLDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getById('tdl', id);
      setTdl(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch TDL details');
      console.error('Error fetching TDL:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTDLDetail();
  }, [fetchTDLDetail]);

  // Performance: Memoized calculations
  const totalLoad = useCallback(() => {
    if (!tdl) return 0;
    return tdl.charge_ac + tdl.charge_dc + tdl.charge_gen + tdl.charge_clim;
  }, [tdl]);

  const loadPercentages = useCallback(() => {
    if (!tdl) return {};
    const total = totalLoad();
    return {
      ac: ((tdl.charge_ac / total) * 100).toFixed(1),
      dc: ((tdl.charge_dc / total) * 100).toFixed(1),
      gen: ((tdl.charge_gen / total) * 100).toFixed(1),
      clim: ((tdl.charge_clim / total) * 100).toFixed(1)
    };
  }, [tdl, totalLoad]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <h4 className="mt-3">Loading TDL Details...</h4>
        </div>
      </Container>
    );
  }

  if (error || !tdl) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading TDL</Alert.Heading>
          <p>{error || 'TDL not found'}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={fetchTDLDetail}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/locations/tdl')}>
              Back to TDL List
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const percentages = loadPercentages();

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">🏢 TDL Site {tdl.id}</h1>
              <p className="text-muted mb-0">Total Distribution Location - {tdl.region}</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/locations/tdl')}
              >
                ← Back to List
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/tdl')}
              >
                Manage TDL
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Main Info Card */}
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📊 Site Overview</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Site ID:</td>
                        <td>{tdl.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Region:</td>
                        <td>
                          <Badge bg="primary">{tdl.region}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">SDS Status:</td>
                        <td>
                          <Badge bg={tdl.SDS ? 'success' : 'warning'}>
                            {tdl.SDS ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Floor Space:</td>
                        <td>{tdl.esp_plan} m²</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Cabinets:</td>
                        <td>{tdl.nb_cab} units</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Address:</td>
                        <td>{tdl.adresse}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">City:</td>
                        <td>{tdl.ville}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Postal Code:</td>
                        <td>{tdl.code_postal}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total Load:</td>
                        <td className="fw-bold text-primary">
                          {totalLoad().toLocaleString()} W
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Load Distribution */}
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">⚡ Load Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>AC Load</small>
                  <small>{percentages.ac}%</small>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={percentages.ac} 
                  className="mb-2"
                />
                <div className="text-end">
                  <strong>{tdl.charge_ac?.toLocaleString()} W</strong>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>DC Load</small>
                  <small>{percentages.dc}%</small>
                </div>
                <ProgressBar 
                  variant="info" 
                  now={percentages.dc} 
                  className="mb-2"
                />
                <div className="text-end">
                  <strong>{tdl.charge_dc?.toLocaleString()} W</strong>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Generator Load</small>
                  <small>{percentages.gen}%</small>
                </div>
                <ProgressBar 
                  variant="warning" 
                  now={percentages.gen} 
                  className="mb-2"
                />
                <div className="text-end">
                  <strong>{tdl.charge_gen?.toLocaleString()} W</strong>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Climate Load</small>
                  <small>{percentages.clim}%</small>
                </div>
                <ProgressBar 
                  variant="danger" 
                  now={percentages.clim} 
                  className="mb-2"
                />
                <div className="text-end">
                  <strong>{tdl.charge_clim?.toLocaleString()} W</strong>
                </div>
              </div>

              <hr />
              <div className="text-center">
                <h4 className="text-primary mb-0">
                  {totalLoad().toLocaleString()} W
                </h4>
                <small className="text-muted">Total Load</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(TDLDetail); // Performance: Prevent unnecessary re-renders
