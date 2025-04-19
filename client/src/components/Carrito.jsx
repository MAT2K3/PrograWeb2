import React, { useEffect, useState } from 'react';
import './CarritoStyle.css';
import { Link } from 'react-router-dom';

function Carrito() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="Car-container">
      <div className="Car-main-header">
        <header>
          <img className="Car-logo-image" src="logo.png" alt="Logo" />
          <div className="Car-search-bar">
            <input type="text" placeholder="buscar..." />
            <button type="submit">buscar</button>
          </div>

          <nav>
            <ul>
              <li><a href="#">Ayuda</a></li>
              <li><a href="#">Cerrar sesión</a></li>
            </ul>
          </nav>
        </header>
        <nav className="Car-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Ventas</a></li>
            <li><a href="#">Mensajes</a></li>
            <li><a href="#">Carrito</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="Car-container-inner">
          <div className="Car-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><Link to="/Profile">Mi perfil</Link></li>
              <li><a href="#">Amigos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="Car-container-inner-right">
          <h2>Tu Carrito</h2>
          <div className="Car-cart-items">
            <div className="Car-cart-item">
              <img className="Car-cart-item-image" src="producto1.jpeg" alt="Producto 1" />
              <div className="Car-cart-item-info">
                <h3>Consola PSP Vita</h3>
                <p>Cantidad: 1</p>
                <p>Precio: $150.00</p>
                <button className="Car-remove-item">Eliminar</button>
              </div>
            </div>

            <div className="Car-cart-item">
              <img className="Car-cart-item-image" src="producto2.jpeg" alt="Producto 2" />
              <div className="Car-cart-item-info">
                <h3>Nintendo Switch lite azul</h3>
                <p>Cantidad: 2</p>
                <p>Precio: $60.00</p>
                <button className="Car-remove-item">Eliminar</button>
              </div>
            </div>

            <div className="Car-cart-summary">
              <h3>Total: $270.00</h3>
              <button className="Car-checkout">Proceder al pago</button>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Carrito;