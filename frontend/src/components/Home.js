import React from 'react';

const Home = () => {
  const sectionStyle = {
    backgroundImage: 'url(/images/bgr_home.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',  // Höhe der Sektion auf 100% des Viewports setzen
    color: 'white',  // Textfarbe für bessere Lesbarkeit
    padding: '20px',  // Optional: Padding für inneren Abstand
  };

  return (
    <section id="start" className="section" style={sectionStyle}>
      <h1>Willkommen</h1>
      <p>Dies ist der Startbereich der Anwendung.</p>
    </section>
  );
};

export default Home;
