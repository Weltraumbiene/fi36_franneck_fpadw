import React from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';


const Navigation = ({isLoggedIn, handleLogout}) => {
    return <Navbar bg="dark" variant="light" expand="lg" className='nav'>
    <Container>
      <Navbar.Brand as={Link} to="/"><Image src={logo} width="50" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/contact">Kontakt</Nav.Link>
        {isLoggedIn ?
          <>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
          :
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        }
      </Navbar.Collapse>
    </Container>
  </Navbar>;
}

export default Navigation;