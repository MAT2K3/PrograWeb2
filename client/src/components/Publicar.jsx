import React, { useEffect, useState } from 'react';
import './PublicarStyle.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Publicar() {
  const [usuario, setUsuario] = useState(null);
  const [file, setFile] = useState(null);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [incrementValues, setIncrementValues] = useState({});
  const navigate = useNavigate()
        
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
              document.title = "Publicar";
                
              return () => {
                document.title = "8BitTreasures";
              };
            }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      console.log("Datos del usuario:", parsedUser);
    }
  }, []);

  const obtenerProductos = async () => {
    if (!usuario) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/products/getposts/${usuario.id}`);
      console.log("Productos obtenidos:", response.data);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date)) {
      return "Fecha no válida";
    }
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (usuario) {
      obtenerProductos();
    }
  }, [usuario]);

  const validarFormulario = (formData) => {
    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const available = parseInt(formData.get('available'));

    if (!title || title.trim() === '') {
      return { valido: false, mensaje: 'El título es obligatorio' };
    }
    
    if (!description || description.trim() === '') {
      return { valido: false, mensaje: 'La descripción es obligatoria' };
    }

    if (!file) {
      return { valido: false, mensaje: 'La imagen es obligatoria' };
    }

    if (isNaN(price) || price <= 0) {
      return { valido: false, mensaje: 'El precio debe ser mayor que 0' };
    }

    if (isNaN(available) || available <= 0) {
      return { valido: false, mensaje: 'La cantidad disponible debe ser mayor que 0' };
    }

    return { valido: true };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('user_id', usuario?.id);
    formData.append('title', event.target.title.value);
    formData.append('description', event.target.description.value);
    formData.append('price', event.target.price.value);
    formData.append('available', event.target.available.value);
    formData.append('platform', event.target.platform.value);
    formData.append('consoleType', event.target.consoleType.value);
    formData.append('image', file);

    const validacion = validarFormulario(formData);
    if (!validacion.valido) {
      setMensaje({ tipo: 'error', texto: validacion.mensaje });
      setTimeout(() => setMensaje(null), 5000);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/products/publish", {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: '¡Publicación realizada con éxito!' });
        event.target.reset();
        setFile(null);
        await obtenerProductos();
      } else {
        setMensaje({ tipo: 'error', texto: `Error al publicar: ${result.message}` });
      }
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      console.error('Error en la publicación:', error);
      setMensaje({ tipo: 'error', texto: 'Error de conexión al publicar' });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleIncrementValueChange = (productId, value) => {
    setIncrementValues(prev => ({
      ...prev,
      [productId]: parseInt(value) || 0
    }));
  };

  const incrementarCantidad = async (productId) => {
    const cantidad = incrementValues[productId] || 0;
    
    if (cantidad <= 0) {
      setMensaje({ tipo: 'error', texto: 'La cantidad a incrementar debe ser mayor que 0' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/products/increment/${productId}`, {
        cantidad: cantidad
      });

      if (response.status === 200) {
        setMensaje({ tipo: 'exito', texto: `Se incrementaron ${cantidad} unidades correctamente` });
        await obtenerProductos();
        setIncrementValues(prev => ({
          ...prev,
          [productId]: 0
        }));
      }
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
      setMensaje({ tipo: 'error', texto: 'Error al incrementar la cantidad' });
    }
    
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="Pub-container">
      <div className="Pub-main-header">
        <header>
          <img className="Pub-logo-image" src="/logo.png" alt="Logo" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar sesión</a>
          </nav>
        </header>

        <nav className="Pub-second-nav">
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
        <div className="Pub-container-inner">
          <div className="Pub-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to = "/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

        <div className="Pub-container-inner-right">
          <div className="Pub-post-form">
            <h2>Crear nueva publicación de un artículo</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                id="Pub-title"
                name="title"
                placeholder="Ingrese el título de la publicación..."
              />

              <input
                type="text"
                id="Pub-description"
                name="description"
                placeholder="¿Qué estás pensando vender?..."
              />

              <label htmlFor="Pub-price">Precio:</label>
              <input
                type="number"
                id="Pub-price"
                name="price"
                placeholder="100.99"
                min="0.01"
                step="0.01"
              />

              <label htmlFor="Pub-available">Disponibles:</label>
              <input
                type="number"
                id="Pub-available"
                name="available"
                placeholder="10"
                min="1"
                step="1"
              />

              <br></br>
              <label htmlFor="Pub-category1">Plataforma:</label>
              <select id="Pub-category1" name="platform">
                <option value="general">General</option>
                <option value="nintendo">Nintendo</option>
                <option value="sony">Sony</option>
                <option value="microsoft">Microsoft</option>
              </select>

              <label htmlFor="Pub-category2">Tipo de consola:</label>
              <select id="Pub-category2" name="consoleType">
                <option value="general">General</option>
                <option value="sobremesa">Sobremesa</option>
                <option value="portatil">Pórtatil</option>
                <option value="especial">Edición especial</option>
              </select>

              <br></br>
              <label htmlFor="Pub-image">Imagen de la consola:</label>
              <input 
                type="file" 
                id="Pub-image" 
                name="image" 
                accept="image/*" 
                onChange={handleFileChange}
              />

              <input type="submit" value="Publicar" />
            </form>
            
            {mensaje && (
              <div className={`reg-mensaje-${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
          </div>

          <div className="Pub-posts">
            <h2>Mis publicaciones</h2>
            <div className="Pub-post-container">
              {productos.length === 0 ? (
                <p>No tienes publicaciones aún.</p>
              ) : (
                productos.map((producto) => (
                  <div key={producto._id} className='Pub-Link'>
                    <Link to={`/Product/${producto._id}`} className='TheLink'>
                      <h2>{producto.nombre}</h2>
                      <p>{producto.descripcion}</p>
                      {producto.foto && <img src={producto.foto} alt="Imagen de la publicación" />}
                      <p>Fecha: <span className="Pub-date">{formatFecha(producto.fechapublicado)}</span></p>
                      <p>Precio: ${producto.precio}</p>
                      <p>Disponibles: {producto.disponibles}</p>
                    </Link>
                    
                    <div className="increment-section" style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
                      <label>Incrementar stock:</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                        <input
                          type="number"
                          min="1"
                          placeholder="Cantidad"
                          value={incrementValues[producto._id] || ''}
                          onChange={(e) => handleIncrementValueChange(producto._id, e.target.value)}
                          style={{ width: '80px', padding: '5px' }}
                        />
                        <button className='increment-button' onClick={() => incrementarCantidad(producto._id)}>
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="Pub-footer">
        <p>© 2025 8BitTreasures - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Publicar;