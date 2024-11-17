// src/components/Login.js
import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login({isLoggedIn, setIsLoggedIn}) {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        try {
          const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
          });
          const data = await response.json();

          if (response.ok) {
            localStorage.setItem('token', data.token); // Speichert das Token
            localStorage.setItem('userId', data.userId);  // userId speichern
            setMessage('Erfolgreich eingeloggt! Sie werden zur Startseite weitergeleitet.');
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/');
            }, 4000);
          } else {
            setMessage(data.message || 'Login fehlgeschlagen');
          }
        } catch (error) {
          console.error("Fehler beim Login:", error);
          setMessage("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
    };

    return (
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
        <Card className="text-center shadow-sm">
            <Card.Body>
            <Card.Title>Anmelden</Card.Title>

            {message && <Alert variant={isLoggedIn ? "success" : "danger"}>{message}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                <Form.Label>Benutzername</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Benutzername eingeben"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                <Form.Label>Passwort</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                Anmelden
                </Button>
            </Form>

            </Card.Body>
            </Card>
            </Col>
        </Row>
    );
}

export default Login;