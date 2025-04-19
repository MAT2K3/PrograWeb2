import React, { useEffect, useState } from 'react';
import './BusquedaAvanzada.css';
import { Link } from 'react-router-dom';

function BusquedaAvanzada() {
  const [usuario, setUsuario] = useState(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        setUsuario(JSON.parse(storedUser));
      }
    }, []);

  return (
    <div className="BA-container">
      <div className="BA-main-header">
        <header>
          <img className="BA-logo-image" src="logo.png" alt="Logo" />
          <div className="BA-search-bar">
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
        <nav className="BA-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Mensajes</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="BA-container-inner">
          <div className="BA-profile-box">
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

        <div className="BA-container-inner-right">
          <div className="BA-search-form">
            <h2>Búsqueda avanzada</h2>
            <form action="#" method="POST" encType="multipart/form-data">
              <label htmlFor="BA-busqueda">Texto de búsqueda:</label>
              <input type="text" id="BA-busqueda" name="busqueda" placeholder="Ingrese búsqueda..." />

              <label htmlFor="BA-fecha_inicio">Fecha Inicio:</label>
              <input type="date" id="BA-fecha_inicio" name="fecha_inicio" />

              <label htmlFor="BA-fecha_fin">Fecha Fin:</label>
              <input type="date" id="BA-fecha_fin" name="fecha_fin" />

              <label htmlFor="BA-vendedor">Seleccionar Vendedor:</label>
              <select id="BA-vendedor" name="vendedor">
                <option value="">Seleccionar vendedor</option>
                <option value="vendedor1">Vendedor 1</option>
                <option value="vendedor2">Vendedor 2</option>
                <option value="vendedor3">Vendedor 3</option>
                <option value="vendedor4">Vendedor 4</option>
              </select>

              <label htmlFor="BA-category">Categoría:</label>
              <select id="BA-category" name="category">
                <option value="general">General</option>
                <option value="movies">Películas</option>
                <option value="books">Libros</option>
              </select>

              <input type="submit" value="Buscar" />
            </form>
          </div>

          <div className="BA-posts">
            <h2>Resultados de la búsqueda:</h2>
            <div className="BA-post-container">
              <h2>Pack Nintendo</h2>
              <p>Hola, es mi primera publicación, el pack contiene varias Nintendos 3DS.</p>
              <img src="publi.jpg" alt="Imagen de la publicación" />
              <p>Fecha: <span className="BA-date">2 de Febrero de 2025</span></p>
            </div>
          </div>
        </div>
      </main>

      <footer className="BA-footer">
        <p>2025 8BitTreasures. Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default BusquedaAvanzada;