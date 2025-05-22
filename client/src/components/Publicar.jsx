import React, { useEffect, useState } from 'react';
import './PublicarStyle.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function Publicar() {
  const [usuario, setUsuario] = useState(null);
  const [file, setFile] = useState(null);
  const [productos, setProductos] = useState([]); // <-- Para guardar los productos

  // Recuperar el usuario al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      console.log("Datos del usuario:", parsedUser);
    }
  }, []);

  // Obtener los productos del usuario
  const obtenerProductos = async () => {
    if (!usuario) return; // Evitar que se llame antes de que usuario esté listo
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
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Asegura que el mes sea de 2 dígitos
    const day = date.getDate().toString().padStart(2, "0"); // Asegura que el día sea de 2 dígitos
  
    return `${year}-${month}-${day}`;
  };

  // Cada vez que el usuario se cargue (por ejemplo al refrescar), obtener sus productos
  useEffect(() => {
    if (usuario) {
      obtenerProductos();
    }
  }, [usuario]);

  // Manejar la publicación de un nuevo producto
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

    try {
      const response = await fetch("http://localhost:8080/api/products/publish", {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert('¡Publicación realizada con éxito!');
        await obtenerProductos(); // <-- Recargar productos
      } else {
        alert('Error al publicar: ' + result.message);
      }
    } catch (error) {
      console.error('Error en la publicación:', error);
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="Pub-container">
      <div className="Pub-main-header">
        <header>
          <img className="Pub-logo-image" src="/logo.png" alt="Logo" />
          <nav>
            <a href="#">Cerrar sesión</a>
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
                min="0"
                step="0.01" // Para permitir decimales como 10.99
              />

              <label htmlFor="Pub-available">Disponibles:</label>
              <input
                type="number"
                id="Pub-available"
                name="available"
                placeholder="10"
                min="0"
                step="1" // Para permitir decimales como 10.99
              />

              <br></br>
              <label htmlFor="Pub-category1">Plataforma:</label>
              <select id="Pub-category1" name="platform">
                <option value="general">General</option>
                <option value="nintendo">Nintendo</option>
                <option value="sega">Sega</option>
                <option value="microsoft">Microsoft</option>
              </select>

              <label htmlFor="Pub-category2">Tipo de consola:</label>
              <select id="Pub-category2" name="consoleType">
                <option value="general">General</option>
                <option value="sobremesa">Sobremesa</option>
                <option value="portatil">Pórtatil</option>
                <option value="especial">Edición especial</option>
              </select>

              <label htmlFor="Pub-image">Imagen de la consola:</label>
              <input type="file" id="Pub-image" name="image" accept="image/*" onChange={handleFileChange} />

              <input type="submit" value="Publicar" />
            </form>
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
                    {/* Mostramos la imagen del producto si existe */}
                    {producto.foto && <img src={producto.foto} alt="Imagen de la publicación" />}
                    <p>Fecha: <span className="Pub-date">{formatFecha(producto.fechapublicado)}</span></p>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="Pub-footer">
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Publicar;