import React from 'react';
import './ProfileStyle.css';

function Profile() {
  return (
    <div className="Prfl-container">
      <div className="Prfl-main-header">
        <header>
          <img className="Prfl-logo-image" src="logo.png" alt="Logo" />
          <div className="Prfl-search-bar">
            <input type="text" placeholder="buscar..." />
            <button type="submit">Search</button>
          </div>

          <nav>
            <ul>
              <li><a href="#">Ayuda</a></li>
              <li><a href="#">Cerrar sesión</a></li>
            </ul>
          </nav>
        </header>
        <nav className="Prfl-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Mensajes</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="Prfl-container-inner">
          <div className="Prfl-profile-box">
            <h2>EliWoods (•̀. •́ )و</h2>
            <img className="Prfl-profile-image" src="maka.jpg" alt="Profile" />
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Mi perfil</a></li>
              <li><a href="#">Amigos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="Prfl-container-inner-right">
          <div className="Prfl-edit-profile">
            <h2>Editar perfil</h2>
            <form action="#" method="POST" encType="multipart/form-data">
              <label htmlFor="Nombre">Nombre:</label>
              <input type="text" id="Nombre" name="Nombre" />
              <label htmlFor="Email">Email:</label>
              <input type="text" id="Email" name="Email" />
              <label htmlFor="Usuario">Usuario:</label>
              <input type="text" id="Usuario" name="Usuario" />
              <label htmlFor="Contraseña">Contraseña:</label>
              <input type="text" id="Contraseña" name="Contraseña" />
              <label htmlFor="Confirmar-contraseña">Confirmar contraseña:</label>
              <input type="text" id="Confirmar-contraseña" name="Confirmar-contraseña" />
              <label htmlFor="Fecha de Nacimiento">Fecha de Nacimiento:</label>
              <input type="date" placeholder="Fecha de Nacimiento" />
              <label htmlFor="Imagen de perfil">Imagen de perfil:</label>
              <input type="file" id="image" name="image" accept="image/*" />
              <input type="submit" value="Modificar" />
            </form>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Profile;