import React, { useEffect, useState } from 'react';
import './HistoryC.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function HistorialCompras() {
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);
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
    const obtenerCompras = async () => {
      if (!usuario) return;

      try {
        const { data } = await axios.get(`/api/buys/histc/${usuario.id}`);
        setCompras(data.compras);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    obtenerCompras();
  }, [usuario]);

  return (
    <div className="HistC-container">
      <div className="HistC-main-header">
        <header>
          <img src="/logo.png" alt="Logo" className="HistC-logo-image" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar Sesión</a>
          </nav>
        </header>

        <div className="HistC-second-nav">
          <ul>
            <li><Link to="/Busqueda">Buscar</Link></li>
            <li><Link to="/Messages">Mensajes</Link></li>
            {usuario && usuario.rol === 'vendedor' && (
              <>
                <li><Link to="/Publicar">Productos</Link></li>
                <li><Link to="/HistSeller">Ventas</Link></li>
              </>
            )}
            
            {usuario && usuario.rol === 'comprador' && (
              <>
                <li><Link to="/Carrito">Carrito</Link></li>
                <li><Link to="/HistClient">Compras</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      <main>
        <div className="HistC-container-inner">
          <div className="HistC-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} alt="Avatar" />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

        <div className="HistS-container-inner-right">
          <section className="HistS-sales-history">
            <h2>Historial de Compras</h2>

            {compras.length > 0 ? (
              compras.map((compra, index) => (
                <div className="HistS-sale-item" key={index}>
                  <img src={compra.fotoProducto} alt="Producto" className="HistS-product-image" />
                  <div className="HistS-sale-details">
                    <p><strong>Producto:</strong> {compra.nombreProducto || 'Nombre no disponible'}</p>
                    <p><strong>Vendedor:</strong> {compra.nombreVendedor || 'Desconocido'}</p>
                    <p><strong>Fecha:</strong> {new Date(compra.fechaCompra).toLocaleDateString()}</p>
                    <p><strong>Cantidad:</strong> {compra.cantidad}</p>
                    <p><strong>Total:</strong> ${compra.totalProducto}</p>
                    <p><strong>Método de pago:</strong> {compra.metodoPago}</p>
                    <p><strong>Estado:</strong> {compra.estado}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron compras.</p>
            )}
          </section>
        </div>
      </main>

      <footer className="HistC-footer">
        <p>© 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HistorialCompras;