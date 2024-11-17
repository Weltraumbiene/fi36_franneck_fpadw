import React from 'react';
import logo from '../logo.svg';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';

const Navigation = ({ isLoggedIn, handleLogout }) => {
  return (
    <Navbar bg="dark" variant="light" expand="lg" className="nav">
      <Container>
        <Navbar.Brand href="#start">
          <Image src={logo} width="50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav.Link href="#start">Start</Nav.Link>
          <Nav.Link href="#contact">Kontakt</Nav.Link>
          <Nav.Link href="#impressum">Impressum</Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link href="#profile">Profil</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <Nav.Link href="#shop">Anmelden</Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
