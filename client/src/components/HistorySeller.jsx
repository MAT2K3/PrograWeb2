import React, { useEffect, useState } from 'react';
import './HistoryS.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function HistorialVentas() {
  const [usuario, setUsuario] = useState(null);
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate()
      
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
        console.log("Datos del usuario:", parsedUser);
      }
    }, []);

    useEffect(() => {
    const obtenerVentas = async () => {
      if (!usuario) return;

      try {
        const { data } = await axios.get(`/api/buys/hists/${usuario.id}`);
        setVentas(data.ventas);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    obtenerVentas();
  }, [usuario]);

  return (
    <div className="HistS-container">
      <div className="HistS-main-header">
        <header>
          <img src="/logo.png" alt="Logo" className="HistS-logo-image" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar Sesión</a>
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

          {ventas.length > 0 ? (
            ventas.map((venta, index) => (
              <div className="HistS-sale-item" key={index}>
                <img src={venta.producto.foto} alt="Producto" className="HistS-product-image" />
                <div className="HistS-sale-details">
                  <p><strong>Producto:</strong> {venta.producto?.nombre || 'Nombre no disponible'}</p>
                  <p><strong>Cliente:</strong> {venta.comprador?.username || 'Desconocido'}</p>
                  <p><strong>Fecha:</strong> {new Date(venta.fechaCompra).toLocaleDateString()}</p>
                  <p><strong>Cantidad:</strong> {venta.cantidad}</p>
                  <p><strong>Precio unitario:</strong> ${venta.precioUnitario}</p>
                  <p><strong>Total:</strong> ${venta.precioUnitario * venta.cantidad}</p>
                  <p><strong>Método de pago:</strong> {venta.metodoPago}</p>
                  <p><strong>Estado:</strong> <span className={`HistS-status HistS-status-${venta.estado.toLowerCase().replace(' ', '-')}`}>{venta.estado}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron ventas.</p>
          )}
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