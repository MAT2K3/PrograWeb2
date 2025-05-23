import React, { useEffect, useState } from 'react';
import './ProfileStyle.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apllpat: "",
    apllmat: "",
    correo: "",
    username: "",
    contra: "",
    confirmar: "",
    fechanacimiento: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate()

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
    document.title = "Mi Perfil";
    
    return () => {
      document.title = "8BitTreasures";
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      navigate("/");
    }
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.fechanacimiento) {
        parsedUser.fechanacimiento = new Date(parsedUser.fechanacimiento).toISOString().split("T")[0];
      }

      setFormData({
        nombres: parsedUser.nombres,
        apllpat: parsedUser.apllpat,
        apllmat: parsedUser.apllmat,
        correo: parsedUser.correo,
        username: parsedUser.username,
        contra: parsedUser.contra,
        confirmar: parsedUser.contra,
        fechanacimiento: parsedUser.fechanacimiento,
      });

      setUsuario(parsedUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (mensaje) {
      setMensaje(null);
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

  const validarFormulario = () => {
    const campos = { nombres: 'Nombre', apllpat: 'Apellido Paterno', apllmat: 'Apellido Materno', contra: 'Contraseña', fechanacimiento: 'Fecha de Nacimiento' };
    
    for (const [campo, nombre] of Object.entries(campos)) {
      if (!formData[campo] || !formData[campo].toString().trim()) {
        setMensaje({ 
          tipo: 'error', 
          texto: `El campo ${nombre} no puede estar vacío.` 
        });
        return false;
      }
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
      setMensaje({ tipo: 'error', texto: mensajeError });
      return false;
    }

    if (formData.contra !== formData.confirmar) {
      setMensaje({ 
        tipo: 'error', 
        texto: "Las contraseñas no coinciden." 
      });
      return false;
    }

    const { esValida: fechaValida, mensaje: mensajeFecha } = validarFechaNacimiento(formData.fechanacimiento);
    if (!fechaValida) {
      setMensaje({ tipo: 'error', texto: mensajeFecha });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setMensaje(null);

    if (!validarFormulario()) {
      return;
    }
  
    const dataToSend = new FormData();
    dataToSend.append("nombres", formData.nombres.trim());
    dataToSend.append("apllpat", formData.apllpat.trim());
    dataToSend.append("apllmat", formData.apllmat.trim());
    dataToSend.append("contra", formData.contra);
    dataToSend.append("fechanacimiento", formData.fechanacimiento);
  
    if (nuevaImagen) {
      dataToSend.append("image", nuevaImagen);
    }
  
    console.log("Datos que se enviarán:");
    console.log({
      Nombre: formData.nombres.trim(),
      ApllPat: formData.apllpat.trim(),
      ApllMat: formData.apllmat.trim(),
      Contraseña: formData.contra,
      FechaNacimiento: formData.fechanacimiento,
      Imagen: nuevaImagen ? nuevaImagen.name : "No se cambió imagen"
    });
  
    try {
      const response = await fetch(`http://localhost:8080/api/users/actualizar/${usuario.id}`, {
        method: "PUT",
        body: dataToSend,
      });
  
      const result = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...usuario,
          nombres: formData.nombres.trim(),
          apllpat: formData.apllpat.trim(),
          apllmat: formData.apllmat.trim(),
          contra: formData.contra,
          fechanacimiento: formData.fechanacimiento,
          avatar: nuevaImagen ? URL.createObjectURL(nuevaImagen) : usuario.avatar,
        };

        setUsuario(updatedUser);
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
        setMensaje({ tipo: 'exito', texto: "Perfil actualizado correctamente" });
      } else {
        setMensaje({ 
          tipo: 'error', 
          texto: result.message || "Error al actualizar el perfil" 
        });
      }
    } catch (error) {
      console.error("Error de conexión o de servidor:", error);
      setMensaje({ 
        tipo: 'error', 
        texto: "Error de conexión con el servidor" 
      });
    }
  };

  return (
    <div className="Prfl-container">
      <div className="Prfl-main-header">
        <header>
          <img className="Prfl-logo-image" src="logo.png" alt="Logo" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar sesión</a>
          </nav>
        </header>
        <nav className="Pub-second-nav">
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
        <div className="Prfl-container-inner">
          <div className="Prfl-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>

        <div className="Prfl-container-inner-right">
          <div className="Prfl-edit-profile">
            <h2>Editar perfil</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="nombres">Nombre:</label>
              <input type="text" name="nombres" value={formData.nombres || ''} onChange={handleChange} />

              <label htmlFor="apllpat">Apellido Paterno:</label>
              <input type="text" name="apllpat" value={formData.apllpat || ''} onChange={handleChange} />

              <label htmlFor="apllmat">Apellido Materno:</label>
              <input type="text" name="apllmat" value={formData.apllmat || ''} onChange={handleChange} />

              <label htmlFor="correo">Email:</label>
              <input 
                type="text" 
                name="correo" 
                value={formData.correo || ''} 
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                title="El correo no se puede modificar"
              />

              <label htmlFor="username">Usuario:</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username || ''} 
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                title="El nombre de usuario no se puede modificar"
              />

              <label htmlFor="contra">Contraseña:</label>
              <input type="text" name="contra" value={formData.contra || ''} onChange={handleChange} />

              <label htmlFor="confirmar">Confirmar contraseña:</label>
              <input type="text" name="confirmar" value={formData.confirmar || ''} onChange={handleChange} />

              <label htmlFor="fechanacimiento">Fecha de Nacimiento:</label>
              <input type="date" name="fechanacimiento" value={formData.fechanacimiento || ''} onChange={handleChange} />

              <label htmlFor="image">Imagen de perfil (opcional):</label>
              <input type="file" name="image" accept="image/*" onChange={(e) => setNuevaImagen(e.target.files[0])} />

              <input type="submit" value="Modificar" />
              
              {mensaje && (
                <div className={`reg-mensaje-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}
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