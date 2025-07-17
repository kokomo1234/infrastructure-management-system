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
      const tdlAcEquipment = acResponse.data.filter(ac => ac.TDL_id === parseInt(id));
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
            <Card.Body className="p-0">
              {/* Top Section - AC Equipment Cards */}
              <div className="bg-light p-4 border-bottom">
                <Row>
                  <Col>
                    <h6 className="mb-3 text-primary">📋 Équipement AC pour ce TDL</h6>
                    {acEquipment.length > 0 ? (
                      <Row>
                        {acEquipment.map((ac) => (
                          <Col lg={4} md={6} key={ac.id} className="mb-3">
                            <Card className="h-100 shadow-sm border-0">
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1 text-dark">{ac.nom}</h6>
                                    <small className="text-muted">ID: {ac.id}</small>
                                  </div>
                                  <Badge bg={ac.type === 'UPS' ? 'success' : 'info'} className="ms-2">
                                    {ac.type}
                                  </Badge>
                                </div>
                                <div className="small mb-2">
                                  <div className="mb-1"><strong>Sortie AC:</strong> {ac.output_ac?.toLocaleString()} W</div>
                                  <div className="mb-1"><strong>Tension:</strong> {ac.voltage} V</div>
                                  <div className="mb-1"><strong>Phase:</strong> {ac.phase}</div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <Badge bg="outline-secondary" text="dark">SLA: {ac.SLA}%</Badge>
                                  {ac.fabricant_nom && (
                                    <small className="text-muted">{ac.fabricant_nom}</small>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-exclamation-circle fa-2x mb-2"></i>
                          <p className="mb-0">Aucun équipement AC trouvé pour ce TDL</p>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>

              {/* Bottom Section - Analysis and Charts */}
              <div className="p-4">
                <Row>
                  {/* Left Column - AC Load Analysis */}
                  <Col lg={4} className="mb-4">
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
                          style={{ height: '8px' }}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Charge: {tdl.charge_ac?.toLocaleString()} W</span>
                          <span>Alimentation: {totalAcSupply().toLocaleString()} W</span>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Middle Column - Graph */}
                  <Col lg={4} className="mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                      <div className="text-center text-primary">
                        <i className="fas fa-chart-line fa-3x mb-3"></i>
                        <h6 className="mb-1">Graphique avec besoins AC et</h6>
                        <h6 className="mb-1">alimentation AC sur les</h6>
                        <h6 className="mb-2">5 prochaines années</h6>
                        <small className="text-muted">(À implémenter)</small>
                      </div>
                    </div>
                  </Col>

                  {/* Right Column - Future Section */}
                  <Col lg={4} className="mb-4">
                    <div className="border border-2 border-dashed p-3 rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                      <div className="text-center text-muted">
                        <i className="fas fa-plus-circle fa-2x mb-3"></i>
                        <h6 className="mb-1">Créer une section,</h6>
                        <h6 className="mb-1">mais laisser vide</h6>
                        <h6 className="mb-0">pour l'instant</h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(TDLDetail); // Performance: Prevent unnecessary re-renders
