import React from "react";
import  "./RegistroStyle.css";
import { Link } from 'react-router-dom';

function Registro() {
  return (
    <div className="reg-wrapper">
      <form action="">
        <h1>★ Registrate</h1>
        <div className="reg-input-box">
          <div className="reg-input-field">
            <input type="text" placeholder="usuario" required />
            <i className="bx bxs-user-circle"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" placeholder="Nombre" required />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" placeholder="Apellido Paterno" required />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" placeholder="Apellido Materno" required />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="email" placeholder="email" required />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" placeholder="contraseña" required />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" placeholder="confirmar contraseña" required />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="date" required />
          </div>
          <div className="reg-input-image">
            <input type="file" required id="imagen_perfil" />
            <input type="text" placeholder="foto de perfil" id="nombre-archivo" />
            <i className="bx bx-image"></i>
            <label htmlFor="imagen_perfil"></label>
          </div>
        </div>
        <button type="submit" className="reg-btn">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Registro;