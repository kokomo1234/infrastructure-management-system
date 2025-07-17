import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tdl: 0,
    tsf: 0,
    ac: 0,
    dc: 0,
    hvac: 0,
    genTsw: 0,
    autre: 0,
    besoin: 0,
    fournisseurs: 0,
    fabricant: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const endpoints = [
        'tdl', 'tsf', 'ac', 'dc', 'hvac', 'gen-tsw', 
        'autre', 'besoin', 'fournisseurs', 'fabricant'
      ];
      
      const promises = endpoints.map(endpoint => 
        apiService.getAll(endpoint).catch(() => ({ data: [] }))
      );
      
      const results = await Promise.all(promises);
      
      setStats({
        tdl: results[0].data.length,
        tsf: results[1].data.length,
        ac: results[2].data.length,
        dc: results[3].data.length,
        hvac: results[4].data.length,
        genTsw: results[5].data.length,
        autre: results[6].data.length,
        besoin: results[7].data.length,
        fournisseurs: results[8].data.length,
        fabricant: results[9].data.length
      });
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const StatCard = ({ title, count, variant = "primary", description }) => (
    <Col md={6} lg={4} xl={3} className="mb-4">
      <Card className="h-100">
        <Card.Body className="text-center">
          <Card.Title className={`text-${variant}`}>{title}</Card.Title>
          <h2 className={`display-4 text-${variant}`}>{count}</h2>
          {description && <Card.Text className="text-muted">{description}</Card.Text>}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h1 className="display-4">Infrastructure Management Dashboard</h1>
          <p className="lead">Overview of your telecommunications infrastructure</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Locations</h3>
        </Col>
      </Row>
      <Row>
        <StatCard 
          title="TDL Sites" 
          count={stats.tdl} 
          variant="primary"
          description="Total distribution locations"
        />
        <StatCard 
          title="TSF Facilities" 
          count={stats.tsf} 
          variant="info"
          description="Technical service facilities"
        />
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Equipment</h3>
        </Col>
      </Row>
      <Row>
        <StatCard 
          title="AC Equipment" 
          count={stats.ac} 
          variant="success"
          description="UPS and OND systems"
        />
        <StatCard 
          title="DC Equipment" 
          count={stats.dc} 
          variant="warning"
          description="Batteries and DC systems"
        />
        <StatCard 
          title="HVAC Systems" 
          count={stats.hvac} 
          variant="danger"
          description="Cooling and climate control"
        />
        <StatCard 
          title="Generators & TSW" 
          count={stats.genTsw} 
          variant="dark"
          description="Power generation equipment"
        />
        <StatCard 
          title="Other Equipment" 
          count={stats.autre} 
          variant="secondary"
          description="Miscellaneous infrastructure"
        />
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Management</h3>
        </Col>
      </Row>
      <Row>
        <StatCard 
          title="Requirements" 
          count={stats.besoin} 
          variant="primary"
          description="Infrastructure needs"
        />
        <StatCard 
          title="Suppliers" 
          count={stats.fournisseurs} 
          variant="info"
          description="Equipment suppliers"
        />
        <StatCard 
          title="Manufacturers" 
          count={stats.fabricant} 
          variant="success"
          description="Equipment manufacturers"
        />
      </Row>
    </div>
  );
};

export default Dashboard;
