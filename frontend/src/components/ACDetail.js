import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import apiService from '../services/api';

const ACDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ac, setAc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchACDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getById('ac', id);
        setAc(response.data);
        setError(null);
      } catch (err) {
        setError('Échec du chargement des détails de l\'équipement AC');
        console.error('Error fetching AC details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchACDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p className="mt-2">Chargement des détails de l'équipement AC...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!ac) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Équipement non trouvé</Alert.Heading>
          <p>L'équipement AC avec l'ID {id} n'a pas été trouvé.</p>
          <Button variant="outline-warning" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">{ac.nom}</h2>
              <div className="d-flex align-items-center">
                <Badge bg={ac.type === 'UPS' ? 'success' : 'info'} className="me-2">
                  {ac.type}
                </Badge>
                <span className="text-muted">ID: {ac.id}</span>
              </div>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>
              Retour
            </Button>
          </div>
        </Col>
      </Row>

      {/* Equipment Details */}
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Spécifications Techniques
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Capacité AC:</strong>
                    <div className="text-primary fs-4 fw-bold">
                      {ac.output_ac?.toLocaleString()} W
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Tension:</strong>
                    <div>{ac.voltage} V</div>
                  </div>
                  <div className="mb-3">
                    <strong>Phase:</strong>
                    <div>{ac.phase}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Puissance Totale:</strong>
                    <div>{ac.puissance_tot?.toLocaleString()} W</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>SLA:</strong>
                    <div>
                      <Badge bg={ac.SLA >= 99 ? 'success' : ac.SLA >= 95 ? 'warning' : 'danger'}>
                        {ac.SLA}%
                      </Badge>
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Bypass:</strong>
                    <div>{ac.Bypass}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Date d'Installation:</strong>
                    <div>{ac.date_inst}</div>
                  </div>
                  <div className="mb-3">
                    <strong>OOD:</strong>
                    <div>
                      <Badge bg={ac.OOD ? 'danger' : 'success'}>
                        {ac.OOD ? 'Oui' : 'Non'}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Network Configuration */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-network-wired me-2"></i>
                Configuration Réseau
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Adresse IP:</strong>
                    <div><code>{ac.ip}</code></div>
                  </div>
                  <div className="mb-3">
                    <strong>Passerelle:</strong>
                    <div><code>{ac.gateway}</code></div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Masque de Sous-réseau:</strong>
                    <div><code>{ac.netmask}</code></div>
                  </div>
                  <div className="mb-3">
                    <strong>Port Switch:</strong>
                    <div>{ac.port_sw}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Location Info */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                Localisation
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Site TDL:</strong>
                <div>{ac.TDL_id}</div>
              </div>
              <div className="mb-3">
                <strong>TSF ID:</strong>
                <div>{ac.TSF_id}</div>
              </div>
              <div className="mb-3">
                <strong>Paire ID:</strong>
                <div>{ac.Paire_id}</div>
              </div>
            </Card.Body>
          </Card>

          {/* Equipment Info */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Informations Équipement
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Modèle:</strong>
                <div>{ac.modèle}</div>
              </div>
              <div className="mb-3">
                <strong>Numéro de Série:</strong>
                <div>{ac.no_série}</div>
              </div>
              <div className="mb-3">
                <strong>Fournisseur ID:</strong>
                <div>{ac.fournisseur_id}</div>
              </div>
              <div className="mb-3">
                <strong>Fabricant ID:</strong>
                <div>{ac.fabricant_id}</div>
              </div>
              <div className="mb-3">
                <strong>ING:</strong>
                <div>{ac.ING}</div>
              </div>
            </Card.Body>
          </Card>

          {/* Comments */}
          {ac.commentaire && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-comment me-2"></i>
                  Commentaires
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{ac.commentaire}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ACDetail;
