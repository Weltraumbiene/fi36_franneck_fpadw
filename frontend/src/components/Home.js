import React, { useState, useEffect } from 'react';
import '../css/Home.css';

const Home = () => {
  const images = [
    '/images/slide/image1.jpg',
    '/images/slide/image2.jpg',
    '/images/slide/image3.jpg', // Füge hier den vollständigen Pfad zu deinen Bildern hinzu
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Wechsel alle 3 Sekunden
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="start" className="section">
      <div className="slideshow-container">
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          className="slideshow-image"
        />
      </div>
      <h1>Willkommen</h1>
      <p>Dies ist der Startbereich der Anwendung.</p>
    </section>
  );
};

export default Home;
