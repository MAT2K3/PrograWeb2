import React, { useEffect, useState } from 'react';
import './ProfileStyle.css';
import { Link } from 'react-router-dom';

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
    fechanacimiento: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Formatear fecha si existe
      if (parsedUser.fechanacimiento) {
        parsedUser.fechanacimiento = new Date(parsedUser.fechanacimiento).toISOString().split("T")[0];
      }

      // Inicializar formData con los valores del usuario
      setFormData({
        nombres: parsedUser.nombres,
        apllpat: parsedUser.apllpat,
        apllmat: parsedUser.apllmat,
        correo: parsedUser.correo,
        username: parsedUser.username,
        contra: parsedUser.contra,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Crear un objeto con los datos que se enviarán
    const dataToSend = new FormData();
    dataToSend.append("nombres", formData.nombres);
    dataToSend.append("apllpat", formData.apllpat);
    dataToSend.append("apllmat", formData.apllmat);
    dataToSend.append("correo", formData.correo);
    dataToSend.append("username", formData.username);
    dataToSend.append("contra", formData.contra);
    dataToSend.append("fechanacimiento", formData.fechanacimiento);
  
    if (nuevaImagen) {
      dataToSend.append("image", nuevaImagen);
    } else {
      dataToSend.append("avatarActual", usuario?.avatar || "");
    }
  
    // Mostrar los datos a enviar en la consola
    console.log("Datos que se enviarán:");
    console.log({
      Nombre: formData.nombres,
      ApllPat: formData.apllpat,
      ApllMat: formData.apllmat,
      Email: formData.correo,
      Usuario: formData.username,
      Contraseña: formData.contra,
      FechaNacimiento: formData.fechanacimiento,
      Imagen: nuevaImagen ? nuevaImagen.name : usuario?.avatar || "No se cambió imagen"
    });
  
    try {
      const response = await fetch(`http://localhost:8080/api/users/actualizar/${usuario.id}`, {
        method: "PUT",
        body: dataToSend,
      });
  
      if (response.ok) {
        const result = await response.json(); // Asegúrate que tu backend devuelve JSON actualizado

        // ✅ Actualiza el estado y el localStorage con los nuevos datos
        const updatedUser = {
          ...usuario,
          ...formData,
          avatar: nuevaImagen ? URL.createObjectURL(nuevaImagen) : usuario.avatar,
        };

        setUsuario(updatedUser);
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
        alert("✅ Perfil actualizado correctamente");
      } else {
        console.error("❌ Error al enviar los datos. Código:", response.status);
      }
    } catch (error) {
      console.error("🚨 Error de conexión o de servidor:", error);
    }
  };

  return (
    <div className="Prfl-container">
      <div className="Prfl-main-header">
        <header>
          <img className="Prfl-logo-image" src="logo.png" alt="Logo" />
          <nav>
            <a href="#">Cerrar sesión</a>
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
              <input type="text" name="correo" value={formData.correo || ''} onChange={handleChange} />

              <label htmlFor="username">Usuario:</label>
              <input type="text" name="username" value={formData.username || ''} onChange={handleChange} />

              <label htmlFor="contra">Contraseña:</label>
              <input type="text" name="contra" value={formData.contra || ''} onChange={handleChange} />

              <label htmlFor="confirmar">Confirmar contraseña:</label>
              <input type="text" name="confirmar" value={formData.contra || ''} onChange={handleChange} />

              <label htmlFor="fechanacimiento">Fecha de Nacimiento:</label>
              <input type="date" name="fechanacimiento" value={formData.fechanacimiento || ''} onChange={handleChange} />

              <label htmlFor="image">Imagen de perfil:</label>
              <input type="file" name="image" accept="image/*" onChange={(e) => setNuevaImagen(e.target.files[0])} />

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