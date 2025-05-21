import React from 'react';
import './HistoryC.css';

function HistorialCompras() {
  return (
    <div className="HistC-container">
      <div className="HistC-main-header">
        <header>
          <img src="logo.png" alt="Logo" className="HistC-logo-image" />
          <nav>
            <ul>
              <li><a href="perfil.html">Perfil</a></li>
              <li><a href="mensajes.html">Mensajes</a></li>
              <li><a href="historial.html">Historial</a></li>
            </ul>
          </nav>
        </header>
      </div>

      <nav className="HistC-second-nav">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Buscar productos</a></li>
          <li><a href="#">Carrito</a></li>
          <li><a href="#">Soporte</a></li>
        </ul>
      </nav>

      <main>
        <aside className="HistC-container-inner">
          <h2>Opciones</h2>
          <ul>
            <li><a href="#">Mi cuenta</a></li>
            <li><a href="#">Ajustes</a></li>
            <li><a href="#">Cerrar sesión</a></li>
          </ul>
        </aside>

        <section className="HistC-container-inner-right">
          <div className="HistC-purchase-history">
            <h2>Historial de Compras</h2>

            <div className="HistC-purchase-item">
              <p><strong>Fecha:</strong> 15/05/2025</p>
              <p><strong>Producto:</strong> Guitarra Electroacústica Yamaha</p>
              <p><strong>Precio:</strong> $450.00</p>
              <p><strong>Estado:</strong> Entregado</p>
            </div>

            <div className="HistC-purchase-item">
              <p><strong>Fecha:</strong> 03/04/2025</p>
              <p><strong>Producto:</strong> Pedal de Efectos BOSS DS-1</p>
              <p><strong>Precio:</strong> $59.99</p>
              <p><strong>Estado:</strong> Entregado</p>
            </div>

            <div className="HistC-purchase-item">
              <p><strong>Fecha:</strong> 18/03/2025</p>
              <p><strong>Producto:</strong> Cuerdas D'Addario .010</p>
              <p><strong>Precio:</strong> $9.99</p>
              <p><strong>Estado:</strong> Cancelado</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="HistC-footer">
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HistorialCompras;