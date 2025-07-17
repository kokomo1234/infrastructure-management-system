import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import BuildInfo from './BuildInfo';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Gestion d'Infrastructure</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Tableau de Bord</Nav.Link>
            </LinkContainer>
            
            <NavDropdown title="Emplacements" id="locations-dropdown">
              <LinkContainer to="/locations/tdl">
                <NavDropdown.Item>🏢 Sites TDL</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/locations/tsf">
                <NavDropdown.Item>🔧 Installations TSF</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/tdl">
                <NavDropdown.Item>⚙️ Gérer TDL</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/tsf">
                <NavDropdown.Item>⚙️ Gérer TSF</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            
            <NavDropdown title="Équipement" id="equipment-dropdown">
              <LinkContainer to="/ac">
                <NavDropdown.Item>⚡ Équipement AC</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/dc">
                <NavDropdown.Item>🔋 Équipement DC</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/hvac">
                <NavDropdown.Item>🌡️ Systèmes HVAC</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/gen-tsw">
                <NavDropdown.Item>⛽ Générateurs & TSW</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/autre">
                <NavDropdown.Item>📦 Autres Équipements</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            
            <NavDropdown title="Gestion" id="management-dropdown">
              <LinkContainer to="/besoin">
                <NavDropdown.Item>📝 Besoins</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/fournisseurs">
                <NavDropdown.Item>🚚 Fournisseurs</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/fabricant">
                <NavDropdown.Item>🏭 Fabricants</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
          
          {/* Performance: Build Info in top right */}
          <Nav className="ms-auto">
            <Nav.Item className="d-flex align-items-center">
              <BuildInfo />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
