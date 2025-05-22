import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import './Product.css';
import { useNavigate } from 'react-router-dom';

function Product() {
  const [usuario, setUsuario] = useState(null);
  const { id } = useParams(); // ✅ Captura el ID de la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1); // Estado para la cantidad seleccionada
  const [addingToCart, setAddingToCart] = useState(false); // Estado para controlar el proceso de agregar al carrito
  const [mensaje, setMensaje] = useState(null);
  const [puedeReseñar, setPuedeReseñar] = useState(false);
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [loadingReseñas, setLoadingReseñas] = useState(true);
  const [enviandoReseña, setEnviandoReseña] = useState(false);
  const navigate = useNavigate();
          
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/InicioSesion");
  };
    
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      console.log("Datos del usuario:", parsedUser);
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        console.log('Status:', res.status);
        console.log('Content-Type:', res.headers.get('content-type'));
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return res.text().then(text => {
            console.log('Respuesta no-JSON recibida:', text);
            throw new Error('La API no devolvió JSON. Verifica la URL y la configuración del servidor.');
          });
        }
        
        return res.json();
      })
      .then(data => {
        console.log('Datos recibidos:', data);
        setProducto(data);
        setLoading(false);
        console.log("Nombre del vendedor:", data.publicador.username);
      })
      .catch(err => {
        console.error('Error al obtener el producto:', err);
        alert(`Ocurrió un error:\n${err.message}`);
        setLoading(false);
      });
  }, [id]);

  // Cargar reseñas del producto
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/reviews/producto/${id}`)
        .then(res => {
          setReseñas(res.data.reseñas || []);
          setLoadingReseñas(false);
        })
        .catch(err => {
          console.error('Error al cargar reseñas:', err);
          setLoadingReseñas(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (!usuario || !producto) return;

    axios.get(`/api/buys/histc/${usuario.id}`)
      .then(res => {
        const compras = res.data.compras;
        console.log("Verificando compras del usuario");
        const compraValida = compras.some(c =>
          c.nombreProducto === producto.nombre && 
          (c.estado === "Entregado" || c.estado === "Cancelado")
        );
        
        // También verificar que no haya dejado ya una reseña
        const yaReseñado = reseñas.some(r => r.usuario._id === usuario.id);
        
        setPuedeReseñar(compraValida && !yaReseñado);
      })
      .catch(console.error);
  }, [usuario, producto, reseñas]);

  const handleCantidadChange = (e) => {
    setCantidad(parseInt(e.target.value));
  };

  // Función para agregar al carrito
  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!usuario) {
      setMensaje({ tipo: 'error', texto: 'Debes iniciar sesión para agregar productos al carrito.' });
      return;
    }
    
    try {
      setAddingToCart(true);
      setMensaje(null);
      
      // Preparar los datos a enviar
      const cartData = {
        userId: usuario.id,
        productId: producto._id,
        cantidad: cantidad
      };
      
      // Registrar los datos para depuración
      console.log('Datos enviados al servidor:', cartData);
      
      const response = await axios.post('http://localhost:8080/api/carts/add', cartData);
      
      console.log('Respuesta del servidor:', response.data);
      setMensaje({ tipo: 'exito', texto: 'Producto agregado al carrito correctamente.' });
      
      // Opcional: Resetear cantidad a 1 después de agregar
      setCantidad(1);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      console.log('Respuesta de error:', error.response?.data);
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.message || 'Error al agregar al carrito. Inténtalo de nuevo.' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReseña = async (e) => {
    e.preventDefault();
    
    if (!usuario) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }
    
    if (!rating || !comentario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    try {
      setEnviandoReseña(true);
      
      const reseñaData = {
        usuario: usuario.id,
        producto: id,
        comentario: comentario.trim(),
        calificacion: rating
      };
      
      const response = await axios.post('http://localhost:8080/api/reviews/crear', reseñaData);
      
      // Agregar la nueva reseña a la lista
      setReseñas(prevReseñas => [response.data.reseña, ...prevReseñas]);
      
      // Limpiar el formulario
      setComentario('');
      setRating(null);
      setPuedeReseñar(false); // Ya no puede reseñar
      
      // Recargar el producto para obtener la nueva calificación promedio
      const productoResponse = await fetch(`http://localhost:8080/api/products/${id}`);
      const productoActualizado = await productoResponse.json();
      setProducto(productoActualizado);
      
      alert('¡Reseña publicada exitosamente!');
      
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      alert(error.response?.data?.message || 'Error al enviar la reseña. Inténtalo de nuevo.');
    } finally {
      setEnviandoReseña(false);
    }
  };

  // Función para renderizar estrellas
  const renderStars = (calificacion) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= calificacion ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <div>Cargando producto...</div>;
  if (!producto) return <div>No se pudo cargar el producto.</div>;

  return (
    <div className="Prod-container">
      <div className="Prod-main-header">
        <header>
          <img className="Prod-logo-image" src="/logo.png" alt="Logo" />
          <nav>
            <a onClick={cerrarSesion}>Cerrar sesión</a>
          </nav>
        </header>
        <nav className="Prod-second-nav">
          <ul>
            <li><Link to="/Busqueda">Buscar</Link></li>
            <li><Link to="/Messages">Mensajes</Link></li>
            {usuario && usuario.rol === 'vendedor' && (
              <>
                <li><Link to="/Publicar">Productos</Link></li>
                <li><Link to="/HistSeller">Ventas</Link></li>
              </>
            )}

            {usuario && usuario.rol === 'comprador' && (
              <>
                <li><Link to="/Carrito">Carrito</Link></li>
                <li><Link to="/HistClient">Compras</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <main>
        <aside className="Prod-container-inner">
          <div className="Prod-profile-box">
            <h2>{usuario ? usuario.username : "Cargando..."}</h2>
            <img className="Prfl-profile-image" src={usuario?.avatar} />
            <ul>
              <li><Link to="/Profile">Mi perfil</Link></li>
            </ul>
          </div>
        </aside>

        <section className="Prod-container-inner-right">
          <div className="Prod-product-detail">
            <h2>{producto.nombre}</h2>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <img src={producto.foto} alt={producto.nombre} className="Prod-product-image" />
            <p><strong>Precio:</strong> ${parseFloat(producto.precio).toFixed(2)}</p>
            <p><strong>Disponibles:</strong> {parseInt(producto.disponibles)}</p>
            <p><strong>Vendido por:</strong> <Link to={"/Messages"}>{producto.publicador.username}</Link></p>
            
            {/* Mostrar calificación promedio */}
            {producto.calificacionPromedio > 0 && (
              <div className="product-rating">
                <strong>Calificación: </strong>
                {renderStars(Math.round(producto.calificacionPromedio))}
                <span>({producto.calificacionPromedio}/5)</span>
              </div>
            )}
            
            {mensaje && (
              <div className={`mensaje-${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
            {usuario && usuario.rol === 'comprador' && usuario._id !== producto.publicador._id && (
              <form onSubmit={handleAddToCart}>
                <label htmlFor="cantidad">Cantidad:</label>
                <select id="cantidad" name="cantidad" value={cantidad} onChange={handleCantidadChange}>
                  {Array.from({ length: producto.disponibles }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button type="submit" className="Prod-add-to-cart-button" disabled={addingToCart}>
                  {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </form>
            )}
          </div>

          <div className="Prod-product-comments">
            <h3>Reseñas del Producto ({reseñas.length})</h3>

            {puedeReseñar && (
              <div className="Prod-leave-review">
                <h4>Deja tu reseña</h4>
                <form onSubmit={handleSubmitReseña}>
                  <label>Calificación:</label>
                  <div className="rating-container">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="retro-radio">
                        <input
                          type="radio"
                          name="calificacion"
                          value={num}
                          checked={rating === num}
                          onChange={() => setRating(num)}
                          required
                        />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>

                  <label htmlFor="review">Comentario:</label>
                  <textarea
                    id="review"
                    name="review"
                    rows="4"
                    required
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe tu experiencia con este producto..."
                  ></textarea>

                  <button type="submit" disabled={enviandoReseña}>
                    {enviandoReseña ? 'Publicando...' : 'Publicar reseña'}
                  </button>
                </form>
              </div>
            )}

            {/* Mostrar reseñas existentes */}
            <div className="reviews-list">
              {loadingReseñas ? (
                <p>Cargando reseñas...</p>
              ) : reseñas.length === 0 ? (
                <p>No hay reseñas para este producto aún.</p>
              ) : (
                reseñas.map((reseña) => (
                  <div key={reseña._id} className="Prod-comment">
                    <img 
                      src={reseña.usuario.avatar || "/default-avatar.png"} 
                      alt={reseña.usuario.username} 
                      className="Prod-comment-avatar" 
                    />
                    <div className="Prod-comment-text">
                      <div className="comment-header">
                        <strong>{reseña.usuario.username}</strong>
                        <div className="comment-rating">
                          {renderStars(reseña.calificacion)}
                        </div>
                        <span className="comment-date">
                          {new Date(reseña.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{reseña.comentario}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 RetroStore - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Product;