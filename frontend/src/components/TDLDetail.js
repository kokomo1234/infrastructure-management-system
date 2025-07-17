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
  const [acEquipment, setAcEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Performance: Memoized fetch function
  const fetchTDLDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getById('tdl', id);
      setTdl(response.data);
      
      // Fetch AC equipment for this TDL
      const acResponse = await apiService.getAll('ac');
      
      // Handle TDL ID mapping due to database schema inconsistency:
      // TDL table uses string IDs ('T1', 'T2', 'T3') but AC table uses numeric TDL_id (1, 2, 3)
      const tdlIdMapping = {
        'T1': 1,
        'T2': 2,
        'T3': 3
      };
      
      const numericTdlId = tdlIdMapping[id];
      const tdlAcEquipment = numericTdlId ? 
        acResponse.data.filter(ac => ac.TDL_id === numericTdlId) : [];
      
      setAcEquipment(tdlAcEquipment);
      
      setError(null);
    } catch (err) {
      setError('Échec du chargement des détails TDL');
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

  // Calculate total AC supply from equipment
  const totalAcSupply = useCallback(() => {
    return acEquipment.reduce((total, ac) => total + (ac.output_ac || 0), 0);
  }, [acEquipment]);

  // Calculate AC utilization percentage
  const acUtilization = useCallback(() => {
    const supply = totalAcSupply();
    const load = tdl?.charge_ac || 0;
    return supply > 0 ? ((load / supply) * 100).toFixed(1) : 0;
  }, [tdl, totalAcSupply]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <h4 className="mt-3">Chargement des détails TDL...</h4>
        </div>
      </Container>
    );
  }

  if (error || !tdl) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur de Chargement TDL</Alert.Heading>
          <p>{error || 'TDL non trouvé'}</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={fetchTDLDetail}>
              Réessayer
            </Button>
            <Button variant="secondary" onClick={() => navigate('/locations/tdl')}>
              Retour à la Liste TDL
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
              <h1 className="mb-1">🏢 Site TDL {tdl.id}</h1>
              <p className="text-muted mb-0">Emplacement de Distribution Totale - {tdl.region}</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/locations/tdl')}
              >
                ← Retour à la Liste
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/tdl')}
              >
                Gérer TDL
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
              <h5 className="mb-0">📊 Aperçu du Site</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">ID Site :</td>
                        <td>{tdl.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Région :</td>
                        <td>{tdl.region}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">SDS :</td>
                        <td>
                          <Badge bg={tdl.SDS ? 'success' : 'secondary'}>
                            {tdl.SDS ? 'Oui' : 'Non'}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Surface au Sol :</td>
                        <td>{tdl.esp_plan} m²</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Armoires :</td>
                        <td>{tdl.nb_cab}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Adresse :</td>
                        <td>{tdl.adresse}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Ville :</td>
                        <td>{tdl.ville}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Code Postal :</td>
                        <td>{tdl.code_postal}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Charge Totale :</td>
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
              <h5 className="mb-0">⚡ Répartition des Charges</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Charge AC</small>
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
                  <small>Charge DC</small>
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
                  <small>Charge Générateur</small>
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
                  <small>Charge Climatisation</small>
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
                <small className="text-muted">Charge Totale</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AC Needs Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">⚡ Besoins AC</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                {/* Left Section - AC Equipment and Load Analysis */}
                <Col lg={5} className="mb-4">
                  {/* AC Equipment Cards */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 text-primary">📋 Équipement AC pour ce TDL</h6>
                      <Badge bg="info" className="ms-2">
                        {acEquipment.length} équipement{acEquipment.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    {acEquipment.length > 0 ? (
                      <div className="bg-light p-3 rounded">
                        {acEquipment.map((ac) => (
                          <Card 
                            key={ac.id} 
                            className="mb-2 border-start border-primary border-3 equipment-card" 
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                            onClick={() => window.open(`/equipment/ac/${ac.id}`, '_blank')}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <Card.Body className="py-2 px-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center">
                                    <h6 className="mb-0 text-primary me-2">{ac.nom}</h6>
                                    <Badge bg={ac.type === 'UPS' ? 'success' : 'info'} className="me-2">
                                      {ac.type}
                                    </Badge>
                                    <span className="text-primary fw-bold">{ac.output_ac?.toLocaleString()} W</span>
                                  </div>
                                </div>
                                <i className="fas fa-external-link-alt text-muted small"></i>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                        
                        {/* Total Capacity Summary */}
                        <div className="mt-3 p-2 bg-white rounded border">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong className="text-dark">Capacité Totale AC:</strong>
                            <span className="text-primary fw-bold fs-5">
                              {totalAcSupply().toLocaleString()} W
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-light p-4 rounded text-center">
                        <div className="text-muted">
                          <i className="fas fa-exclamation-circle fa-2x mb-2"></i>
                          <p className="mb-0">Aucun équipement AC trouvé pour ce TDL</p>
                          <small className="text-muted">TDL ID recherché: {id}</small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AC Load Analysis */}
                  <div className="bg-success bg-opacity-10 p-3 rounded mb-3">
                    <h6 className="text-success mb-2">Charge AC (depuis la table TDL)</h6>
                    <h2 className="text-success mb-0">{tdl.charge_ac?.toLocaleString()} W</h2>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="mb-2">Barre de pourcentage (Charge AC / Alimentation AC)</h6>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Utilisation AC</small>
                        <small><strong>{acUtilization()}%</strong></small>
                      </div>
                      <ProgressBar 
                        variant={acUtilization() > 80 ? 'danger' : acUtilization() > 60 ? 'warning' : 'success'}
                        now={Math.min(acUtilization(), 100)}
                        className="mb-2"
                        style={{ height: '12px' }}
                      />
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Charge: {tdl.charge_ac?.toLocaleString()} W</span>
                        <span>Alimentation: {totalAcSupply().toLocaleString()} W</span>
                      </div>
                      
                      {/* Capacity Status */}
                      <div className="small">
                        {totalAcSupply() > 0 ? (
                          <div className="d-flex align-items-center">
                            <i className={`fas fa-circle me-1 ${
                              acUtilization() > 80 ? 'text-danger' : 
                              acUtilization() > 60 ? 'text-warning' : 'text-success'
                            }`}></i>
                            <span className="text-muted">
                              {acUtilization() > 80 ? 'Capacité critique' :
                               acUtilization() > 60 ? 'Capacité élevée' : 'Capacité normale'}
                              {totalAcSupply() > tdl.charge_ac ? 
                                ` (Excédent: ${(totalAcSupply() - tdl.charge_ac).toLocaleString()} W)` :
                                ` (Déficit: ${(tdl.charge_ac - totalAcSupply()).toLocaleString()} W)`
                              }
                            </span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center text-warning">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            <span>Aucune capacité AC disponible</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Right Section - Graph and Future Section */}
                <Col lg={7}>
                  <Row>
                    {/* Graph - 65% of right section */}
                    <Col lg={8} className="mb-4">
                      <div className="bg-primary bg-opacity-10 p-4 rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                        <div className="text-center text-primary">
                          <i className="fas fa-chart-line fa-4x mb-3"></i>
                          <h5 className="mb-2">Graphique avec besoins AC et</h5>
                          <h5 className="mb-2">alimentation AC sur les</h5>
                          <h5 className="mb-3">5 prochaines années</h5>
                          <small className="text-muted">(À implémenter)</small>
                        </div>
                      </div>
                    </Col>

                    {/* Future Section - 35% of right section */}
                    <Col lg={4} className="mb-4">
                      <div className="border border-2 border-dashed p-3 rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                        <div className="text-center text-muted">
                          <i className="fas fa-plus-circle fa-2x mb-3"></i>
                          <h6 className="mb-1">Créer une section,</h6>
                          <h6 className="mb-1">mais laisser vide</h6>
                          <h6 className="mb-0">pour l'instant</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(TDLDetail); // Performance: Prevent unnecessary re-renders
