import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ isLoggedIn }) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Willkommen zu unserem Testprojekt</Card.Title>
              <Card.Text>
                Dies ist ein kleines Projekt in React, das grundlegende Funktionen zur Registrierung und
                Profilverwaltung bietet.
              </Card.Text>

              {isLoggedIn ? (
                <>
                  <Card.Text>Sie sind erfolgreich eingeloggt! Gehen Sie zum Profil, um Ihre Daten zu verwalten.</Card.Text>
                  <Button href="#profile" variant="primary" className="mt-2">
                    Mein Profil
                  </Button>
                </>
              ) : (
                <>
                  <Card.Text>Melden Sie sich an, um Ihr Profil zu erstellen und zu verwalten.</Card.Text>
                  <Button href="#shop" variant="secondary">
                    Anmelden
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
