import React, { useEffect, useState } from 'react';
import './CarritoStyle.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Carrito() {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate()
  
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
          document.title = "Carrito";
          
          return () => {
            document.title = "8BitTreasures";
          };
        }, []);

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
      await fetch(`http://localhost:8080/api/carts/${itemId}/eliminar`, {
        method: "PUT",
      });

      fetchCarrito(usuario.id);
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  const handleSubmitPedido = (e) => {
    e.preventDefault();
    realizarCompra();
    console.log("Pedido enviado");
  };

  const validarTelefono = (telefono) => {
    const soloNumeros = telefono.replace(/\D/g, '');
    return soloNumeros.length === 10;
  };

  const realizarCompra = async () => {
    setMensaje(null);

    if (!carrito || carrito.length === 0) {
      return setMensaje({ 
        tipo: "error", 
        texto: "No puedes realizar una compra sin productos en el carrito." 
      });
    }

    if (!metodoPago || !direccionEnvio || !telefonoContacto) {
      return setMensaje({ 
        tipo: "error", 
        texto: "Todos los campos son obligatorios." 
      });
    }

    if (metodoPago.trim() === "") {
      return setMensaje({ 
        tipo: "error", 
        texto: "Debes seleccionar un método de pago." 
      });
    }

    if (direccionEnvio.trim() === "") {
      return setMensaje({ 
        tipo: "error", 
        texto: "La dirección de envío no puede estar vacía." 
      });
    }

    if (telefonoContacto.trim() === "") {
      return setMensaje({ 
        tipo: "error", 
        texto: "El teléfono de contacto no puede estar vacío." 
      });
    }

    if (!validarTelefono(telefonoContacto)) {
      return setMensaje({ 
        tipo: "error", 
        texto: "El número de teléfono debe contener exactamente 10 dígitos." 
      });
    }

    try {
      const response = await fetch("http://localhost:8080/api/buys/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: usuario.id,
          metodoPago,
          direccionEnvio,
          telefonoContacto
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return setMensaje({ tipo: "error", texto: data.message || "Error al comprar." });
      }

      setMensaje({ tipo: "exito", texto: "¡Compra realizada con éxito!" });
      setMostrarFormularioPago(false);
      setMetodoPago("");
      setDireccionEnvio("");
      setTelefonoContacto("");
      fetchCarrito(usuario.id);
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Ocurrió un error en el servidor." });
    }
  };

  return (
    <div className="Car-container">
      <div className="Car-main-header">
        <header>
          <img className="Car-logo-image" src="logo.png" alt="Logo" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar sesión</a>
          </nav>
        </header>
        <nav className="Car-second-nav">
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
        <div className="Car-container-inner">
          <div className="Car-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

        <div className="Car-container-inner-right">
          <h2>Tu Carrito</h2>
          <div className="Car-cart-items">
            {carrito.length === 0 ? (
              <div className="Car-empty-cart">
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
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
              </>
            )}

            {mostrarFormularioPago && (
              <div className="Car-pago-formulario">
                <h3>Finalizar Compra</h3>
                <form onSubmit={handleSubmitPedido}>
                  <input 
                    type="text" 
                    placeholder="Dirección de envío" 
                    value={direccionEnvio} 
                    onChange={e => setDireccionEnvio(e.target.value)}
                  />
                  <input 
                    type="tel" 
                    placeholder="Teléfono (10 dígitos)" 
                    value={telefonoContacto} 
                    onChange={e => setTelefonoContacto(e.target.value)}
                    maxLength="10"
                  />
                  <select 
                    value={metodoPago} 
                    onChange={e => setMetodoPago(e.target.value)}
                  >
                    <option value="">Selecciona método de pago</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                  <button type="submit">Confirmar Pedido</button>
                  <button type="button" onClick={() => setMostrarFormularioPago(false)}>
                    Cancelar
                  </button>
                </form>
              </div>
            )}
            
            {mensaje && (
              <div className={`mensaje-${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Carrito;