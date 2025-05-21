// Mensajes.jsx
import React from 'react';
import './Messages.css'; // Asegúrate que los estilos tengan las clases con el prefijo Msg-

function Messages() {
  return (
    <div className="Msg-container">
      <div className="Msg-main-header">
        <header>
          <img className="Msg-logo-image" src="logo.png" alt="Logo" />
          <div className="Msg-search-bar">
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

        <nav className="Msg-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Mensajes</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="Msg-container-inner">
          <div className="Msg-profile-box">
            <h2>EliWoods (•̀. •́ )و</h2>
            <img className="Msg-profile-image" src="maka.jpg" alt="Perfil" />
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Mi perfil</a></li>
              <li><a href="#">Amigos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="Msg-container-inner-right">
          <div className="Msg-chat-container">
            <h2>
              Chat con <span id="chat-username">NombreAmigo</span>
            </h2>

            <div className="Msg-messages-box">
              <div className="Msg-message Msg-received">
                <p><strong>NombreAmigo:</strong> ¡Hola! ¿Cómo estás?</p>
              </div>
              <div className="Msg-message Msg-sent">
                <p><strong>Tú:</strong> ¡Todo bien! ¿Y tú?</p>
              </div>
              {/* Puedes agregar más mensajes aquí */}
            </div>

            <form className="Msg-message-form" action="#" method="POST">
              <input
                type="text"
                name="mensaje"
                placeholder="Escribe un mensaje..."
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Messages;
