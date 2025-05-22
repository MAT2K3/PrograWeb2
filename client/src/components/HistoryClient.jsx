import React, { useEffect, useState } from 'react';
import './HistoryC.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function HistorialCompras() {
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
    <div className="HistC-container">
      <div className="HistC-main-header">
        <header>
          <img src="logo.png" alt="Logo" className="HistC-logo-image" />
          <nav>
            <a href="#">Cerrar sesión</a>
          </nav>
        </header>
        <nav className="HistC-second-nav">
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
      </nav>
      </div>

      <main>
        <div className="HistC-container-inner">
          <div className="HistC-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

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