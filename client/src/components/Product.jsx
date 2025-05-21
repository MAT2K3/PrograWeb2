import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Product.css';

function Product() {
  const { id } = useParams(); // ✅ Captura el ID de la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Cargando producto...</div>;
  if (!producto) return <div>No se pudo cargar el producto.</div>;

  return (
    <div className="Prod-container">
      <div className="Prod-main-header">
        <header>
          <img className="Prod-logo-image"  src="logo.png" alt="Logo" />
          <nav>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/perfil">Mi Perfil</a></li>
            </ul>
          </nav>
          <div className="Prod-search-bar">
            <input type="text" placeholder="Buscar..." />
            <button>Buscar</button>
          </div>
        </header>
      </div>

      <nav className="Prod-second-nav">
        <ul>
          <li><a href="#">Categorías</a></li>
          <li><a href="#">Ofertas</a></li>
          <li><a href="#">Lo más vendido</a></li>
          <li><a href="#">Nuevos</a></li>
        </ul>
      </nav>

      <main>
        <aside className="Prod-container-inner">
          <div className="Prod-profile-box">
            <img src="user.png" alt="Tu foto" className="Prod-profile-image" />
            <h2>Mi Usuario</h2>
            <ul>
              <li><a href="#">Mi Cuenta</a></li>
              <li><a href="#">Mis Compras</a></li>
              <li><a href="#">Cerrar Sesión</a></li>
            </ul>
          </div>
        </aside>

        <section className="Prod-container-inner-right">
          <div className="Prod-product-detail">
            <h2>{producto.nombre}</h2>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <img src={producto.foto} alt={producto.nombre} className="Prod-product-image" />
            <p><strong>Precio:</strong> ${parseFloat(producto.precio).toFixed(2)}</p>
            <p><strong>Vendido por:</strong> <a href="#">{producto.publicador.username}</a></p>
          </div>

          <div className="Prod-product-comments">
            <h3>Comentarios del Producto</h3>

            <div className="Prod-leave-review">
              <h4>Deja tu reseña</h4>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="username">Nombre de usuario:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="user-photo">URL de tu foto:</label>
                <input type="text" id="user-photo" name="user-photo" />

                <label htmlFor="review">Comentario:</label>
                <textarea id="review" name="review" rows="4" required></textarea>

                <input type="submit" value="Publicar reseña" />
              </form>
            </div>

            {(producto.comentarios || []).map((comentario, index) => (
              <div key={index} className="Prod-comment">
                <img src={comentario.foto} alt={comentario.usuario} className="Prod-comment-avatar" />
                <div className="Prod-comment-text">
                  <strong>{comentario.usuario}</strong>
                  <p>{comentario.texto}</p>
                </div>
              </div>
            ))}
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
