import React, { useEffect, useState } from 'react';
import './CarritoStyle.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function Carrito() {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      fetchCarrito(parsedUser.id);
      console.log("Datos del usuario:", parsedUser);
    }
  }, []);

  const fetchCarrito = async (userId) => {
    try {
      const res = await axios.get(`/api/carts/${userId}`);
      setCarrito(res.data.carrito.productos || []);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      return total + (item.producto?.precio || 0) * item.cantidad;
    }, 0);
  };

  const eliminarItem = async (itemId) => {
  try {
    await fetch(`http://localhost:3000/api/carts/${itemId}/eliminar`, {
      method: "PUT",
    });

    // Vuelve a cargar el carrito después de eliminar
    fetchCarrito(usuario.id); // tu función que vuelve a traer el carrito del backend
  } catch (error) {
    console.error("Error al eliminar el item:", error);
  }
};

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
            <li><Link to = "/Busqueda">Buscar</Link></li>
            <li><a href="#">Mensajes</a></li>
            {usuario && usuario.rol === 'vendedor' && (
              <>
              <li><Link to = "/Publicar">Productos</Link></li>
              <li><a href="#">Ventas</a></li>
              </>
            )}

            {usuario && usuario.rol === 'comprador' && (
              <>
              <li><a href="#">Carrito</a></li>
              <li><a href="#">Compras</a></li>
              </>
            )}
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
            {carrito.map((item, index) => (
              <div key={index} className="Car-cart-item">
                <img
                  className="Car-cart-item-image"
                  src={item.producto?.foto || "placeholder.png"}
                  alt={item.producto?.nombre}
                />
                <div className="Car-cart-item-info">
                  <h3>{item.producto?.nombre}</h3>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio: ${item.producto?.precio}</p>
                  <button className="Car-remove-item" onClick={() => eliminarItem(item._id)}>Eliminar</button>
                </div>
              </div>
            ))}

            <div className="Car-cart-summary">
              <h3>Total: ${calcularTotal().toFixed(2)}</h3>
              <button className="Car-checkout" onClick={() => setMostrarFormularioPago(true)}>Proceder al pago</button>
            </div>

            {mostrarFormularioPago && (
              <div className="Car-pago-formulario">
                <h3>Finalizar Compra</h3>
                <form >
                  <input type="text" placeholder="Nombre completo" required />
                  <input type="text" placeholder="Dirección" required />
                  <input type="tel" placeholder="Teléfono" required />
                  <select required>
                    <option value="">Selecciona método de pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                  <button type="submit">Confirmar Pedido</button>
                  <button type="button" onClick={() => setMostrarFormularioPago(false)}>
                    Cancelar
                  </button>
                </form>
              </div>
            )}
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