import React,  { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './InicioStyle.css';
import { Link } from 'react-router-dom';

function InicioSesion() {
  const [formData, setFormData] = useState({
    usuario: "",
    contra: ""
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const data = new FormData();
  data.append("usuario", formData.usuario);
  data.append("contra", formData.contra);

  try {
    console.log("Enviando FormData:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuario: formData.usuario,
        contra: formData.contra
      })
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    if (response.ok) {
      console.log("✅ Inicio de sesión exitoso");
      localStorage.setItem("usuario", JSON.stringify(result.user));
      console.log("🧾 Datos completos del usuario:", result.user);
      navigate("/Busqueda"); 
    } else {
      console.error("❌ Error en login:", result.message);
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Ocurrió un error inesperado, intenta nuevamente.");
  }
  };

  return (
    <div className="div-container">
      <img src="https://media.tenor.com/Eo809pAALoYAAAAi/bat.gif" width="180" height="180" loading="lazy" alt="Imagen de carga" />
      <br></br>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Inicio de sesión</h1>
            <div className="input-box">
              <input type="text" placeholder="usuario" name="usuario" onChange={handleChange} required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="contraseña" name="contra" onChange={handleChange} required />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <button type="submit" className="btn">Iniciar sesión</button>

            <div className="register-link">
              <p>No tienes una cuenta? <Link to="/registro">Registrate</Link></p>
            </div>
          </form>
        </div>
    </div>
  );
};

export default InicioSesion;