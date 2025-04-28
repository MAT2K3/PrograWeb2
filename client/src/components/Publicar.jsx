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
          <div className="Pub-search-bar">
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

        <nav className="Pub-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Ventas</a></li>
            <li><a href="#">Mensajes</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="Pub-container-inner">
          <div className="Pub-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><Link to = "/Profile">Mi perfil</Link></li>
              <li><a href="#">Amigos</a></li>
              <li><a href="#">Contacto</a></li>
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
                  <div key={producto._id}>
                    <h2>{producto.nombre}</h2>
                    <p>{producto.descripcion}</p>
                    {/* Mostramos la imagen del producto si existe */}
                    {producto.foto && <img src={producto.foto} alt="Imagen de la publicación" />}
                    <p>Fecha: <span className="Pub-date">{formatFecha(producto.fechapublicado)}</span></p>
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