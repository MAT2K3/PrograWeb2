import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  "./RegistroStyle.css";
import { Link } from 'react-router-dom';

function Registro() {

  const [formData, setFormData] = useState({
    username: "",
    nombres: "",
    apllpat: "",
    apllmat: "",
    correo: "",
    contra: "",
    confirmarContra: "",
    fechanacimiento: "",
    avatar: null,
    rol: "Comprador",
  });

  const [fileName, setFileName] = useState("Selecciona una imagen");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop(); // Extraer extensión
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        avatar: file,  // Guardar el archivo correctamente
        extension: extension, // Guardar extensión en el estado
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.contra !== formData.confirmarContra) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    const data = new FormData();
    data.append("username", formData.username);
    data.append("nombres", formData.nombres);
    data.append("apllpat", formData.apllpat);
    data.append("apllmat", formData.apllmat);
    data.append("correo", formData.correo);
    data.append("contra", formData.contra);
    data.append("fechanacimiento", formData.fechanacimiento);
    data.append("rol", formData.rol);
    data.append("avatar", formData.avatar);
    data.append("extension", formData.extension);
  
    try {
      console.log("Enviando FormData:");
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      // Realizar la solicitud POST al servidor
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: data,
      });
  
      // Leer directamente la respuesta como JSON
      const result = await response.json(); // Aquí solo intentamos leer como JSON
  
      console.log("Respuesta del servidor (JSON):", result);
  
      if (response.ok) {
        alert("Usuario registrado con éxito");
        navigate("/InicioSesion");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Ocurrió un error, intenta nuevamente");
    }
  };

  return (
    <div className="reg-wrapper">
      <form action="" onSubmit={handleSubmit}>
        <h1>★ Registrate</h1>
        <div className="reg-input-box">
          <div className="reg-input-field">
            <input type="text" name="username" placeholder="Usuario" required onChange={handleChange} />
            <i className="bx bxs-user-circle"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="nombres" placeholder="Nombre" required onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="apllpat" placeholder="Apellido Paterno" required onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="apllmat" placeholder="Apellido Materno" required onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="email" name="correo" placeholder="Email" required onChange={handleChange} />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" name="contra" placeholder="Contraseña" required onChange={handleChange} />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" name="confirmarContra" placeholder="confirmar contraseña" required onChange={handleChange} />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="date" name="fechanacimiento" required onChange={handleChange} />
          </div>
          <div className="reg-input-select">
            <select name="rol" required onChange={handleChange} >
              <option value="" disabled selected>Selecciona un rol</option>
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
            </select>
            <i className="bx bx-user"></i>
          </div>
          <div className="reg-input-image">
            <input type="file" required id="imagen_perfil" accept="image/*" onChange={handleFileChange} />
            <input type="text" placeholder={fileName} id="nombre-archivo" />
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