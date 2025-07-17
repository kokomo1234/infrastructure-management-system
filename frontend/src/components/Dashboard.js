import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import apiService from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
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
      setError('Échec du chargement des statistiques du tableau de bord');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Performance: Memoized StatCard component
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

  // Performance: Clickable Location Cards
  const LocationCard = ({ title, count, variant, description, icon, onClick }) => (
    <Col md={6} className="mb-4">
      <Card 
        className="h-100 shadow-sm hover-shadow transition-all location-card"
        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        onClick={onClick}
      >
        <Card.Body className="text-center p-4">
          <div className="mb-3">
            <span className="display-1">{icon}</span>
          </div>
          <Card.Title className={`text-${variant} h3`}>{title}</Card.Title>
          <h2 className={`display-3 text-${variant} mb-3`}>{count}</h2>
          <Card.Text className="text-muted mb-3">{description}</Card.Text>
          <Button 
            variant={`outline-${variant}`} 
            size="lg"
            className="w-100"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Voir {title} →
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h1 className="display-4">Tableau de Bord de Gestion d'Infrastructure</h1>
          <p className="lead">Aperçu de votre infrastructure de télécommunications</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">📍 Emplacements</h3>
          <p className="text-muted mb-4">Cliquez sur n'importe quel type d'emplacement pour voir les informations détaillées</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <LocationCard 
          title="Sites TDL" 
          count={stats.tdl} 
          variant="primary"
          description="Emplacements de Distribution Totaux - Voir tous les sites TDL et leurs informations détaillées"
          icon="🏢"
          onClick={() => navigate('/locations/tdl')}
        />
        <LocationCard 
          title="Installations TSF" 
          count={stats.tsf} 
          variant="info"
          description="Installations de Service Technique - Gérer et surveiller les emplacements de service"
          icon="🔧"
          onClick={() => navigate('/locations/tsf')}
        />
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Équipement</h3>
        </Col>
      </Row>
      <Row>
        <StatCard 
          title="Équipement AC" 
          count={stats.ac} 
          variant="success"
          description="Systèmes UPS et OND"
        />
        <StatCard 
          title="Équipement DC" 
          count={stats.dc} 
          variant="warning"
          description="Batteries et systèmes DC"
        />
        <StatCard 
          title="Systèmes HVAC" 
          count={stats.hvac} 
          variant="danger"
          description="Refroidissement et contrôle climatique"
        />
        <StatCard 
          title="Générateurs & TSW" 
          count={stats.genTsw} 
          variant="dark"
          description="Équipement de génération d'énergie"
        />
        <StatCard 
          title="Autres Équipements" 
          count={stats.autre} 
          variant="secondary"
          description="Infrastructure divers"
        />
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Gestion</h3>
        </Col>
      </Row>
      <Row>
        <StatCard 
          title="Besoins" 
          count={stats.besoin} 
          variant="primary"
          description="Besoins d'infrastructure"
        />
        <StatCard 
          title="Fournisseurs" 
          count={stats.fournisseurs} 
          variant="info"
          description="Fournisseurs d'équipement"
        />
        <StatCard 
          title="Fabricants" 
          count={stats.fabricant} 
          variant="success"
          description="Fabricants d'équipement"
        />
      </Row>
    </div>
  );
};

export default Dashboard;
