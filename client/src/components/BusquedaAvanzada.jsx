import React, { useEffect, useState } from 'react';
import './BusquedaAvanzada.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function BusquedaAvanzada() {
  const [usuario, setUsuario] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate()

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };

  useEffect(() => {
        document.title = "Busqueda avanzada";
        
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
      setUsuario(parsedUser);
    }

    fetch("http://localhost:8080/api/users/vendedores")
    .then(res => res.json())
    .then(data => setVendedores(data))
    .catch(err => console.error("Error al obtener vendedores:", err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

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
          <nav>
            <a onClick={cerrarSesion}>Cerrar Sesión</a>
          </nav>
        </header>
        <nav className="BA-second-nav">
          <ul>
            <li><Link to = "/Busqueda">Buscar</Link></li>
            <li><Link to="/Messages">Mensajes</Link></li>
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

      <main className='BA-main'>
        <div className="BA-container-inner">
          <div className="BA-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to = "/Profile">Mi perfil</Link></li>
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

              <br></br>
              <label htmlFor="BA-vendedor">Seleccionar Vendedor:</label>
              <select id="BA-vendedor" name="vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
                <option value="">Seleccionar vendedor</option>
                {vendedores.map(v => (
                <option key={v._id} value={v._id}>{v.username}</option>
                ))}
              </select>

              <br></br>
              <label htmlFor="BA-category">Plataforma:</label>
              <select id="BA-category" name="platforma" value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
              <option value="">General</option>
                <option value="nintendo">Nintendo</option>
                <option value="sony">Sony</option>
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
                  <div key={producto._id} className="Prod-Link">
                    <Link to={`/Product/${producto._id}`} className='TheLink'>
                    <h2>{producto.nombre}</h2>
                    <p>{producto.descripcion}</p>
                    <img src={producto.foto || 'default.jpg'} alt="Imagen de la publicación" />
                    <p>Fecha: <span className="BA-date">{formatFecha(producto.fechapublicado)}</span></p>
                    </Link>
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
        <p>© 2025 8BitTreasures. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default BusquedaAvanzada;