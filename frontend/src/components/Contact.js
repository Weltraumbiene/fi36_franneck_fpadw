import React, { useState } from 'react';
import '../css/Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus('Bitte fülle alle Felder aus.');
      return;
    }

    try {
      const response = await fetch('http://bcf.mshome.net:4000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Nachricht erfolgreich gesendet!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus(`Fehler: ${data.error}`);
      }
    } catch (error) {
      setStatus('Fehler beim Senden der Nachricht.');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-card">
          <h2>Kontaktformular</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">E-Mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Nachricht</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                required
              />
              <small>{1000 - message.length} Zeichen übrig</small>
            </div>
            <button type="submit">Absenden</button>
          </form>
          {status && <p>{status}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contact;