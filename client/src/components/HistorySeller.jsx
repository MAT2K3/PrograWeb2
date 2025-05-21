import React from 'react';
import './HistoryS.css';

function HistorialVentas() {
  return (
    <div className="HistS-container">
      <div className="HistS-main-header">
        <header>
          <img src="tu-logo.png" alt="Logo" className="HistS-logo-image" />
          <nav>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Mi Perfil</a></li>
              <li><a href="#">Ventas</a></li>
              <li><a href="#">Cerrar Sesión</a></li>
            </ul>
          </nav>
          <div className="HistS-search-bar">
            <input type="text" placeholder="Buscar..." />
            <button>Buscar</button>
          </div>
        </header>
      </div>

      <div className="HistS-second-nav">
        <ul>
          <li><a href="#">Resumen</a></li>
          <li><a href="#">Productos</a></li>
          <li><a href="#">Historial de Ventas</a></li>
        </ul>
      </div>

      <main>
        <div className="HistS-container-inner">
          <h2>Menú Vendedor</h2>
          <ul>
            <li><a href="#">Añadir Producto</a></li>
            <li><a href="#">Modificar Inventario</a></li>
            <li><a href="#">Ventas</a></li>
          </ul>
        </div>

        <div className="HistS-container-inner-right">
          <section className="HistS-sales-history">
            <h2>Historial de Ventas</h2>

            <div className="HistS-sale-item">
              <p><strong>Producto:</strong> Camiseta Retro Pixel</p>
              <p><strong>Cliente:</strong> Juan Pérez</p>
              <p><strong>Fecha:</strong> 2025-05-01</p>
              <p><strong>Total:</strong> $25.00</p>
            </div>

            <div className="HistS-sale-item">
              <p><strong>Producto:</strong> Taza Edición Limitada</p>
              <p><strong>Cliente:</strong> Laura Gómez</p>
              <p><strong>Fecha:</strong> 2025-05-03</p>
              <p><strong>Total:</strong> $15.00</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="HistS-footer">
        <p>© 2025 Mi Sitio Retro. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HistorialVentas;