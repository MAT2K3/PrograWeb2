import React, { useEffect, useState } from "react";
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
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      document.title = "Registro de usuario";
      
      return () => {
        document.title = "8BitTreasures";
      };
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop();
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        extension: extension,
      }));
    }
  };

  const validarContrasena = (password) => {
    const requisitos = {
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /\d/.test(password),
      especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const esValida = Object.values(requisitos).every(req => req);
    return { esValida, requisitos };
  };

  const validarFechaNacimiento = (fecha) => {
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const hace100Anos = new Date();
    hace100Anos.setFullYear(hoy.getFullYear() - 100);

    hoy.setHours(0, 0, 0, 0);
    fechaNac.setHours(0, 0, 0, 0);

    if (fechaNac >= hoy) {
      return { esValida: false, mensaje: "La fecha de nacimiento no puede ser hoy o en el futuro." };
    }

    if (fechaNac < hace100Anos) {
      return { esValida: false, mensaje: "La fecha de nacimiento no puede ser de hace más de 100 años." };
    }

    return { esValida: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const camposObligatorios = ['username', 'nombres', 'apllpat', 'apllmat', 'correo', 'contra', 'confirmarContra', 'fechanacimiento', 'rol'];
    for (const campo of camposObligatorios) {
      if (!formData[campo] || formData[campo].toString().trim() === '') {
        return setMensaje({ 
          tipo: "error", 
          texto: `El campo ${campo === 'apllpat' ? 'apellido paterno' : 
                             campo === 'apllmat' ? 'apellido materno' : 
                             campo === 'fechanacimiento' ? 'fecha de nacimiento' :
                             campo === 'confirmarContra' ? 'confirmar contraseña' :
                             campo} es obligatorio.` 
        });
      }
    }

    if (!formData.avatar) {
      return setMensaje({ tipo: "error", texto: "Debes seleccionar una imagen de perfil." });
    }

    const { esValida: passwordValida, requisitos } = validarContrasena(formData.contra);
    if (!passwordValida) {
      let mensajeError = "La contraseña debe cumplir con los siguientes requisitos: ";
      const faltantes = [];
      
      if (!requisitos.longitud) faltantes.push("mínimo 8 caracteres");
      if (!requisitos.mayuscula) faltantes.push("al menos 1 letra mayúscula");
      if (!requisitos.minuscula) faltantes.push("al menos 1 letra minúscula");
      if (!requisitos.numero) faltantes.push("al menos 1 número");
      if (!requisitos.especial) faltantes.push("al menos 1 carácter especial");
      
      mensajeError += faltantes.join(", ") + ".";
      return setMensaje({ tipo: "error", texto: mensajeError });
    }

    if (formData.contra !== formData.confirmarContra) {
      return setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
    }

    const { esValida: fechaValida, mensaje: mensajeFecha } = validarFechaNacimiento(formData.fechanacimiento);
    if (!fechaValida) {
      return setMensaje({ tipo: "error", texto: mensajeFecha });
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

      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      console.log("Respuesta del servidor (JSON):", result);

      if (response.ok) {
        setMensaje({ tipo: "exito", texto: "Usuario registrado con éxito. Redirigiendo..." });
        setTimeout(() => {
          navigate("/InicioSesion");
        }, 2000);
      } else {
        setMensaje({ tipo: "error", texto: result.message || "Error al registrar usuario." });
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje({ tipo: "error", texto: "Ocurrió un error en el servidor, intenta nuevamente." });
    }
  };

  return (
    <div className="reg-wrapper">
      <form action="" onSubmit={handleSubmit}>
        <h1>★ Registrate</h1>
        <div className="reg-input-box">
          <div className="reg-input-field">
            <input type="text" name="username" placeholder="Usuario" onChange={handleChange} />
            <i className="bx bxs-user-circle"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="nombres" placeholder="Nombre" onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="apllpat" placeholder="Apellido Paterno" onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="text" name="apllmat" placeholder="Apellido Materno" onChange={handleChange} />
            <i className="bx bxs-user-pin"></i>
          </div>
          <div className="reg-input-field">
            <input type="email" name="correo" placeholder="Email" onChange={handleChange} />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" name="contra" placeholder="Contraseña" onChange={handleChange} />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="password" name="confirmarContra" placeholder="confirmar contraseña" onChange={handleChange} />
            <i className="bx bx-lock"></i>
          </div>
          <div className="reg-input-field">
            <input type="date" name="fechanacimiento" onChange={handleChange} />
          </div>
          <div className="reg-input-select">
            <select name="rol" onChange={handleChange} >
              <option value="" disabled selected>Selecciona un rol</option>
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
            </select>
            <i className="bx bx-user"></i>
          </div>
          <div className="reg-input-image">
            <input type="file" id="imagen_perfil" accept="image/*" onChange={handleFileChange} />
            <input type="text" placeholder={fileName} id="nombre-archivo" />
            <i className="bx bx-image"></i>
            <label htmlFor="imagen_perfil"></label>
          </div>
        </div>
        
        <button type="submit" className="reg-btn">
          Registrarse
        </button>

        {mensaje && (
          <div className={`reg-mensaje-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}
        
      </form>
      <div className="register-link">
        <p>¿Ya tienes una cuenta? <Link to="/InicioSesion">Inicía Sesión</Link></p>
      </div>
    </div>
  );
}

export default Registro;