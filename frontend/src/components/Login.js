import React, { useState } from 'react';
import Register from './Register'; // Importiere die Register-Komponente

import '../css/Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setIsLoggedIn(true);
        setMessage('Erfolgreich eingeloggt! Weiterleitung...');
      } else {
        setMessage(data.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <section id="login" className="login-section">
      <div className="login-container">
        <h1>Anmelden</h1>
        {message && <div className="login-message">{message}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            type="email"
            placeholder="E-Mail-Adresse eingeben"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Anmelden
          </button>
        </form>
        <br></br>
        <p className="register-link">
          Noch nicht registriert?{' '}
          <button
            type="button"
            className="open-register-modal-button"
            onClick={() => setShowRegisterModal(true)}
          >
            Hier klicken, um sich zu registrieren!
          </button>
        </p>
      </div>

      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}
    </section>
  );
};

export default Login;