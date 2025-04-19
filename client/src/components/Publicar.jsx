import React, { useEffect, useState } from 'react';
import './PublicarStyle.css';
import { Link } from 'react-router-dom';

function Publicar() {
  const [usuario, setUsuario] = useState(null);
    
      useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
          setUsuario(JSON.parse(storedUser));
        }
      }, []);

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
            <form action="#" method="POST" encType="multipart/form-data">
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
              <select id="Pub-category1" name="category">
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
              <input type="file" id="Pub-image" name="image" accept="image/*" />

              <input type="submit" value="Publicar" />
            </form>
          </div>

          <div className="Pub-posts">
            <h2>Mis publicaciones</h2>
            <div className="Pub-post-container">
              <h2>Pack Nintendo</h2>
              <p>
                Hola es mi primer publicación, el pack contiene: 1 Nintendo 2DS, 1 Nintendo 2DS XL y una...
              </p>
              <img src="/publi.jpg" alt="Imagen de la publicación" />
              <p>Fecha: <span className="Pub-date">2 de Febrero de 2025</span></p>
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