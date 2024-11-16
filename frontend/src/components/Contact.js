// src/components/Contact.js
import React from "react";
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

function ContactForm() {

    const handleSubmit = (e) => {
        console.log("Send contact form");
    }

    return (
        <Row className="justify-content-center">
        <Col md={8} lg={6}>
        <Card className="text-center shadow-sm">
            <Card.Body>

                <Card.Title>Kontaktformular</Card.Title>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ihr Name"
                        required
                    />
                    </Form.Group>

                    <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Nachricht</Form.Label>
                    <Form.Control
                        type="textarea"
                        placeholder="Ihre Nachricht"
                        required
                    />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Absenden
                    </Button>
                </Form>

            </Card.Body>
        </Card>
        </Col>
        </Row>
    );
}

export default ContactForm;