import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Infrastructure Management</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            
            <NavDropdown title="Locations" id="locations-dropdown">
              <LinkContainer to="/tdl">
                <NavDropdown.Item>TDL Sites</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/tsf">
                <NavDropdown.Item>TSF Facilities</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            
            <NavDropdown title="Equipment" id="equipment-dropdown">
              <LinkContainer to="/ac">
                <NavDropdown.Item>AC Equipment</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/dc">
                <NavDropdown.Item>DC Equipment</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/hvac">
                <NavDropdown.Item>HVAC Systems</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/gen-tsw">
                <NavDropdown.Item>Generators & TSW</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/autre">
                <NavDropdown.Item>Other Equipment</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            
            <NavDropdown title="Management" id="management-dropdown">
              <LinkContainer to="/besoin">
                <NavDropdown.Item>Requirements</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/fournisseurs">
                <NavDropdown.Item>Suppliers</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/fabricant">
                <NavDropdown.Item>Manufacturers</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
