import React from 'react';
import './LandingStyle.css';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="Lnd-container">
      <header className="Lnd-main-header">
        <img className="Lnd-logo-image" src="logo.png" alt="Logo 8BitTreasures" />
        <nav className="Lnd-nav">
          <ul>
            <li><a href="#about">Sobre Nosotros</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <section className="Lnd-hero">
        <h1>Bienvenido a 8BitTreasures</h1>
        <p>Encuentra y vende consolas clásicas con facilidad.</p>
        <Link to="/InicioSesion" className="Lnd-cta-button">Explorar</Link>
      </section>

      <img src="banner.jpeg" alt="Consolas retro" className="Lnd-hero-image" />

      <section id="about" className="Lnd-about">
        <h2>Sobre Nosotros</h2>
        <p>Somos una plataforma dedicada a los amantes de los videojuegos retro, facilitando la compra y venta de consolas clásicas.</p>
      </section>

      <section id="contact" className="Lnd-contact">
        <h2>Contacto</h2>
        <p>¿Tienes dudas? Escríbenos a <a href="mailto:soporte@8bittreasures.com">soporte@8bittreasures.com</a></p>
      </section>

      <footer className="Lnd-footer">
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Landing;