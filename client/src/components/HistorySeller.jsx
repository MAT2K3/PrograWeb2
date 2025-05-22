import React, { useEffect, useState } from 'react';
import './HistoryS.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function HistorialVentas() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
        console.log("Datos del usuario:", parsedUser);
      }
    }, []);

  return (
    <div className="HistS-container">
      <div className="HistS-main-header">
        <header>
          <img src="/logo.png" alt="Logo" className="HistS-logo-image" />
          <nav>
            <a href="#">Cerrar Sesión</a>
          </nav>
        </header>

        <div className="HistS-second-nav">
          <ul>
            <li><Link to = "/Busqueda">Buscar</Link></li>
            <li><Link to ="/Messages">Mensajes</Link></li>
            {usuario && usuario.rol === 'vendedor' && (
              <>
              <li><Link to = "/Publicar">Productos</Link></li>
              <li><Link to= "/HistSeller">Ventas</Link></li>
              </>
            )}
            
            {usuario && usuario.rol === 'comprador' && (
              <>
              <li><Link to = "/Carrito">Carrito</Link></li>
              <li><Link to ="/HistClient">Compras</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      <main>
        <div className="HistS-container-inner">
          <div className="HistS-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
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