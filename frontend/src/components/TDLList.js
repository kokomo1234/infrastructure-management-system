import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import apiService from '../services/api';

const TDLList = () => {
  const [tdlSites, setTdlSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Performance: Memoized fetch function
  const fetchTDLSites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAll('tdl');
      setTdlSites(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch TDL sites');
      console.error('Error fetching TDL sites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTDLSites();
  }, [fetchTDLSites]);

  // Performance: Memoized navigation handler
  const handleTDLClick = useCallback((tdlId) => {
    navigate(`/tdl/${tdlId}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading TDL Sites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error Loading TDL Sites</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchTDLSites}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🏢 TDL Sites</h2>
          <p className="text-muted">Total Distribution Locations</p>
        </div>
        <Badge bg="primary" className="fs-6">
          {tdlSites.length} Sites
        </Badge>
      </div>

      {tdlSites.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No TDL Sites Found</Alert.Heading>
          <p>There are currently no TDL sites in the system.</p>
        </Alert>
      ) : (
        <Row>
          {tdlSites.map((tdl) => (
            <Col key={tdl.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
              <Card 
                className="h-100 shadow-sm hover-shadow transition-all"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => handleTDLClick(tdl.id)}
              >
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>TDL {tdl.id}</strong>
                    <Badge bg="light" text="dark">
                      {tdl.region}
                    </Badge>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Region</h6>
                    <p className="mb-0 fw-bold">{tdl.region}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Cabinets</h6>
                    <p className="mb-0">{tdl.nb_cab} units</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Total Load</h6>
                    <p className="mb-0">
                      {(tdl.charge_ac + tdl.charge_dc + tdl.charge_gen + tdl.charge_clim).toLocaleString()} W
                    </p>
                  </div>
                  
                  <div className="row text-center">
                    <div className="col-6">
                      <small className="text-muted">AC Load</small>
                      <div className="fw-bold text-success">{tdl.charge_ac?.toLocaleString()}W</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">DC Load</small>
                      <div className="fw-bold text-info">{tdl.charge_dc?.toLocaleString()}W</div>
                    </div>
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-light">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTDLClick(tdl.id);
                    }}
                  >
                    View Details →
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default React.memo(TDLList); // Performance: Prevent unnecessary re-renders
