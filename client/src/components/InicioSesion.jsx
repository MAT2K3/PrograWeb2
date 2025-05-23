import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './InicioStyle.css';
import { Link } from 'react-router-dom';

function InicioSesion() {
  const [formData, setFormData] = useState({
    usuario: "",
    contra: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (mensaje) {
      setMensaje(null);
    }
  };

  const validarCampos = () => {
    const errores = [];
    
    if (!formData.usuario.trim()) {
      errores.push("El campo usuario es obligatorio");
    }
    
    if (!formData.contra.trim()) {
      errores.push("El campo contraseña es obligatorio");
    }
    
    return errores;
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    
    if (tipo === 'exito') {
      setTimeout(() => {
        setMensaje(null);
      }, 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errores = validarCampos();
    if (errores.length > 0) {
      mostrarMensaje(errores.join(". "), "error");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Enviando datos de login:");
      console.log("Usuario:", formData.usuario);
      console.log("Contraseña: [HIDDEN]");

      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: formData.usuario.trim(),
          contra: formData.contra.trim()
        })
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (response.ok) {
        console.log("✅ Inicio de sesión exitoso");
        
        mostrarMensaje("¡Inicio de sesión exitoso! Redirigiendo...", "exito");
        
        localStorage.setItem("usuario", JSON.stringify(result.user));
        console.log("🧾 Datos completos del usuario:", result.user);
        
        setTimeout(() => {
          navigate("/Busqueda");
        }, 1500);
        
      } else {
        console.error("Error en login:", result.message);
        
        let mensajeError = "Usuario y/o contraseña incorrectos";
        
        if (result.message.includes("Usuario no encontrado")) {
          mensajeError = "El usuario ingresado no existe";
        } else if (result.message.includes("Contraseña incorrecta")) {
          mensajeError = "La contraseña ingresada es incorrecta";
        } else if (result.message.includes("Se requieren")) {
          mensajeError = "Por favor completa todos los campos";
        }
        
        mostrarMensaje(mensajeError, "error");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarMensaje("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="div-container">
      <img 
        src="https://media.tenor.com/Eo809pAALoYAAAAi/bat.gif" 
        width="180" 
        height="180" 
        loading="lazy" 
        alt="Imagen de carga" 
      />
      <br />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Inicio de sesión</h1>
          
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Usuario" 
              name="usuario" 
              value={formData.usuario}
              onChange={handleChange} 
              disabled={isLoading}
              autoComplete="username"
            />
            <i className="bx bxs-user"></i>
          </div>
          
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Contraseña" 
              name="contra" 
              value={formData.contra}
              onChange={handleChange} 
              disabled={isLoading}
              autoComplete="current-password"
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          {mensaje && (
            <div className={`reg-mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          <div className="register-link">
            <p>¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InicioSesion;