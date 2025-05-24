import React, { useEffect, useState } from 'react';
import './Messages.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate()
        
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
            document.title = "Mensajes";
            
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

  return (
    <div className="Msg-container">
      <div className="Msg-main-header">
        <header>
          <img className="Msg-logo-image" src="logo.png" alt="Logo" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar Sesión</a>
          </nav>
        </header>

        <nav className="Msg-second-nav">
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

            {usuario && usuario.rol === 'admin' && (
              <>
              <li><Link to ="/Admin">Gestionar Compras</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <main>
        <div className="Msg-container-inner">
          <div className="Msg-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Msg-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
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
            </div>

            <form className="Msg-message-form">
              <input
                type="text"
                name="mensaje"
                placeholder="Escribe un mensaje..."
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Messages;
