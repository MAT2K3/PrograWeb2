import React from 'react';
import './InicioStyle.css';
import { Link } from 'react-router-dom';

const InicioSesion = () => {
  return (
    <div>
      <body>
        <img src="https://media.tenor.com/Eo809pAALoYAAAAi/bat.gif" width="180" height="180" loading="lazy" alt="Imagen de carga" />
        <div className="wrapper">
          <form action="">
            <h1>Inicio de sesión</h1>
            <div className="input-box">
              <input type="text" placeholder="usuario" required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="contraseña" required />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <button type="submit" className="btn">Iniciar sesión</button>

            <div className="register-link">
              <p>No tienes una cuenta? <Link to="/registro">Registrate</Link></p>
            </div>
          </form>
        </div>
      </body>
    </div>
  );
};

export default InicioSesion;