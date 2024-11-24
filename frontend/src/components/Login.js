import React, { useState } from 'react';
import Register from './Register'; // Importiere die Register-Komponente
import '../css/Login.css';

const Login = ({ setIsLoggedIn, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verbindung explizit herstellen
      const apiUrl = 'http://bcf.mshome.net:4000/api/login';

      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Speichere Token und Benutzer-ID in der Sitzung
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('email', data.email);

        setIsLoggedIn(true);
        setMessage('Erfolgreich eingeloggt! Weiterleitung...');
        setTimeout(() => {
          setCurrentPage('shop'); // Wechsel zur Shop-Seite
        }, 1000);
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