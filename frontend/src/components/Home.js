import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = ({isLoggedIn}) => {
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
                    <Button as={Link} to="/profile" variant="primary" className="mt-2">
                        Mein Profil
                    </Button>
                    </>
                ) : (
                    <>
                    <Card.Text>Melden Sie sich an, um Ihr Profil zu erstellen und zu verwalten.</Card.Text>
                    <div className="d-grid gap-2">
                        {/* <Button as={Link} to="/register" variant="primary">Jetzt registrieren</Button> */}
                        <Button as={Link} to="/login" variant="secondary">Anmelden</Button>
                    </div>
                    </>
                )}
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    )
}

export default Home;
