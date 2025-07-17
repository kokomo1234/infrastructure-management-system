import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import apiService from '../services/api';

const TSFList = () => {
  const [tsfFacilities, setTsfFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Performance: Memoized fetch function
  const fetchTSFFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAll('tsf');
      setTsfFacilities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch TSF facilities');
      console.error('Error fetching TSF facilities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTSFFacilities();
  }, [fetchTSFFacilities]);

  // Performance: Memoized navigation handler
  const handleTSFClick = useCallback((tsfId) => {
    navigate(`/tsf/${tsfId}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="info" />
        <p className="mt-2">Loading TSF Facilities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error Loading TSF Facilities</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchTSFFacilities}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🔧 TSF Facilities</h2>
          <p className="text-muted">Technical Service Facilities</p>
        </div>
        <Badge bg="info" className="fs-6">
          {tsfFacilities.length} Facilities
        </Badge>
      </div>

      {tsfFacilities.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No TSF Facilities Found</Alert.Heading>
          <p>There are currently no TSF facilities in the system.</p>
        </Alert>
      ) : (
        <Row>
          {tsfFacilities.map((tsf) => (
            <Col key={tsf.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
              <Card 
                className="h-100 shadow-sm hover-shadow transition-all"
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => handleTSFClick(tsf.id)}
              >
                <Card.Header className="bg-info text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>TSF {tsf.id}</strong>
                    <Badge bg="light" text="dark">
                      {tsf.region}
                    </Badge>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Region</h6>
                    <p className="mb-0 fw-bold">{tsf.region}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Service Type</h6>
                    <p className="mb-0">{tsf.type_service || 'Technical Service'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Capacity</h6>
                    <p className="mb-0">{tsf.capacite || 'Standard'}</p>
                  </div>
                  
                  <div className="row text-center">
                    <div className="col-6">
                      <small className="text-muted">Status</small>
                      <div className="fw-bold text-success">Active</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Priority</small>
                      <div className="fw-bold text-warning">High</div>
                    </div>
                  </div>
                </Card.Body>
                
                <Card.Footer className="bg-light">
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTSFClick(tsf.id);
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

export default React.memo(TSFList); // Performance: Prevent unnecessary re-renders
