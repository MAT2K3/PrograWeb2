import React, { useEffect, useState } from 'react';
import './BusquedaAvanzada.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function BusquedaAvanzada() {
  const [usuario, setUsuario] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [productos, setProductos] = useState([]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }

    fetch("http://localhost:8080/api/users/vendedores")
    .then(res => res.json())
    .then(data => setVendedores(data))
    .catch(err => console.error("Error al obtener vendedores:", err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    console.log("Búsqueda realizada con los siguientes filtros:");
    console.log("Texto de búsqueda:", nombre);
    console.log("Fecha inicio:", fechaInicio);
    console.log("Fecha fin:", fechaFin);
    console.log("Vendedor:", vendedor);
    console.log("Plataforma:", plataforma);

    try {
      const response = await axios.get('http://localhost:8080/api/products/buscar', {
        params: {
          nombre,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          vendedor,
          plataforma
        }
      });
      console.log('Respuesta de productos:', response.data);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date)) {
      return "Fecha no válida";
    }
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Asegura que el mes sea de 2 dígitos
    const day = date.getDate().toString().padStart(2, "0"); // Asegura que el día sea de 2 dígitos
  
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="BA-container">
      <div className="BA-main-header">
        <header>
          <img className="BA-logo-image" src="logo.png" alt="Logo" />
          <div className="BA-search-bar">
            <input type="text" placeholder="buscar..." />
            <button type="submit">buscar</button>
          </div>

          <nav>
            <ul>
              <li><a href="#">Ayuda</a></li>
              <li><a href="#">Cerrar sesión</a></li>
            </ul>
          </nav>
        </header>
        <nav className="BA-second-nav">
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Buscar</a></li>
            <li><a href="#">Mensajes</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
      </div>

      <main>
        <div className="BA-container-inner">
          <div className="BA-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><Link to = "/Profile">Mi perfil</Link></li>
              <li><a href="#">Amigos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="BA-container-inner-right">
          <div className="BA-search-form">
            <h2>Búsqueda avanzada</h2>
            <form onSubmit={handleSearch}>
              <label htmlFor="BA-busqueda">Texto de búsqueda:</label>
              <input type="text" id="BA-busqueda" name="busqueda" placeholder="Ingrese búsqueda..." value={nombre} onChange={(e) => setNombre(e.target.value)}/>

              <label htmlFor="BA-fecha_inicio">Fecha Inicio:</label>
              <input type="date" id="BA-fecha_inicio" name="fecha_inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}/>

              <label htmlFor="BA-fecha_fin">Fecha Fin:</label>
              <input type="date" id="BA-fecha_fin" name="fecha_fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}/>

              <label htmlFor="BA-vendedor">Seleccionar Vendedor:</label>
              <select id="BA-vendedor" name="vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
                <option value="">Seleccionar vendedor</option>
                {vendedores.map(v => (
                <option key={v._id} value={v._id}>{v.username}</option>
                ))}
              </select>

              <label htmlFor="BA-category">Plataforma:</label>
              <select id="BA-category" name="platforma" value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
              <option value="">General</option>
                <option value="nintendo">Nintendo</option>
                <option value="sega">Sega</option>
                <option value="microsoft">Microsoft</option>
              </select>

              <input type="submit" value="Buscar" />
            </form>
          </div>

          <div className="BA-posts">
            <h2>Resultados de la búsqueda:</h2>
            <div className="BA-post-container">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <div key={producto._id}>
                    <h2>{producto.nombre}</h2>
                    <p>{producto.descripcion}</p>
                    <img src={producto.foto || 'default.jpg'} alt="Imagen de la publicación" />
                    <p>Fecha: <span className="BA-date">{formatFecha(producto.fechapublicado)}</span></p>
                  </div>
                ))
              ) : (
                <p>No se encontraron productos con los filtros aplicados.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="BA-footer">
        <p>2025 8BitTreasures. Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default BusquedaAvanzada;