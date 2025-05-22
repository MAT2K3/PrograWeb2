import React, { useEffect, useState } from 'react';
import './AdminCompras.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function AdminPurchases() {
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      console.log("Datos del usuario:", parsedUser);
    }
  }, []);

  useEffect(() => {
    const obtenerTodasLasCompras = async () => {
      if (!usuario) return;

      try {
        const { data } = await axios.get(`/api/buys/admin/todas`);
        setCompras(data.compras);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    obtenerTodasLasCompras();
  }, [usuario]);

  const actualizarEstado = async (compraId, nuevoEstado) => {
    try {
      setLoading(true);
      await axios.put(`/api/buys/admin/estado/${compraId}`, {
        nuevoEstado: nuevoEstado
      });

      // Actualizar el estado local
      setCompras(prevCompras => 
        prevCompras.map(compra => 
          compra.compraId === compraId 
            ? { ...compra, estado: nuevoEstado }
            : compra
        )
      );

      console.log(`Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado de la compra");
    } finally {
      setLoading(false);
    }
  };

  const puedeClickearEnCamino = (estado) => {
    return estado === "Pendiente";
  };

  const puedeClickearEntregadoOCancelado = (estado) => {
    return estado === "Pendiente" || estado === "En camino";
  };

  return (
    <div className="AdminP-container">
      <div className="AdminP-main-header">
        <header>
          <img src="/logo.png" alt="Logo" className="AdminP-logo-image" />
          <nav>
            <a href="#">Cerrar Sesión</a>
          </nav>
        </header>

        <div className="AdminP-second-nav">
          <ul>
            <li><Link to = "/Busqueda">Buscar</Link></li>
            <li><Link to="/Messages">Mensajes</Link></li>
            <li><Link to="/Admin">Gestionar Compras</Link></li>
          </ul>
        </div>
      </div>
      
      <main className="AdminP-main">
        <div className="AdminP-container-inner">
          <div className="AdminP-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="AdminP-profile-image" src={usuario?.avatar} alt="Avatar" />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

        <div className="AdminP-container-inner-right">
          <section className="AdminP-purchases-history">
            <h2>Gestión de Compras</h2>

            {compras.length > 0 ? (
              compras.map((compra, index) => (
                <div className="AdminP-purchase-item" key={index}>
                  <img src={compra.fotoProducto} alt="Producto" className="AdminP-product-image" />
                  <div className="AdminP-purchase-details">
                    <p><strong>Producto:</strong> {compra.nombreProducto || 'Nombre no disponible'}</p>
                    <p><strong>Comprador:</strong> {compra.nombreComprador || 'Desconocido'}</p>
                    <p><strong>Vendedor:</strong> {compra.nombreVendedor || 'Desconocido'}</p>
                    <p><strong>Fecha:</strong> {new Date(compra.fechaCompra).toLocaleDateString()}</p>
                    <p><strong>Cantidad:</strong> {compra.cantidad}</p>
                    <p><strong>Precio unitario:</strong> ${compra.precioUnitario}</p>
                    <p><strong>Total:</strong> ${compra.totalProducto}</p>
                    <p><strong>Método de pago:</strong> {compra.metodoPago}</p>
                    <p><strong>Dirección:</strong> {compra.direccionEnvio}</p>
                    <p><strong>Teléfono:</strong> {compra.telefonoContacto}</p>
                    <p><strong>Estado:</strong> <span className={`AdminP-status AdminP-status-${compra.estado.toLowerCase().replace(' ', '-')}`}>{compra.estado}</span></p>
                    
                    <div className="AdminP-action-buttons">
                      <button 
                        className="AdminP-btn AdminP-btn-en-camino"
                        onClick={() => actualizarEstado(compra.compraId, "En camino")}
                        disabled={loading || !puedeClickearEnCamino(compra.estado)}
                      >
                        En Camino
                      </button>
                      
                      <button 
                        className="AdminP-btn AdminP-btn-entregado"
                        onClick={() => actualizarEstado(compra.compraId, "Entregado")}
                        disabled={loading || !puedeClickearEntregadoOCancelado(compra.estado)}
                      >
                        Entregado
                      </button>
                      
                      <button 
                        className="AdminP-btn AdminP-btn-cancelado"
                        onClick={() => actualizarEstado(compra.compraId, "Cancelado")}
                        disabled={loading || !puedeClickearEntregadoOCancelado(compra.estado)}
                      >
                        Cancelado
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron compras.</p>
            )}
          </section>
        </div>
      </main>

      <footer className="AdminP-footer">
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default AdminPurchases;