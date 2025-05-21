import React from 'react';
import './Product.css';

function Product() {
  return (
    <div className="Prod-container">
      <div className="Prod-main-header">
        <header>
          <img src="logo.png" alt="Logo" className="Prod-logo-image" />
          <nav>
            <ul>
              <li><a href="index.html">Inicio</a></li>
              <li><a href="productos.html">Productos</a></li>
              <li><a href="perfil.html">Mi Perfil</a></li>
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
            <h2>Consola Retro Pixel 3000</h2>
            <p><strong>Descripción:</strong> Consola portátil de 16 bits con más de 300 juegos retro integrados. Pantalla LCD y batería recargable.</p>
            <img src="producto_ejemplo.jpg" alt="Foto del producto" className="Prod-product-image" />
            <p><strong>Precio:</strong> $45.00</p>
            <p><strong>Vendido por:</strong> <a href="#">@RetroMan</a></p>
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

            <div className="Prod-comment">
              <img src="user1.jpg" alt="Usuario 1" className="Prod-comment-avatar" />
              <div className="Prod-comment-text">
                <strong>@8BitGamer</strong>
                <p>¡La nostalgia pura! Me recuerda a mi infancia. 5/5 ⭐</p>
              </div>
            </div>

            <div className="Prod-comment">
              <img src="user2.jpg" alt="Usuario 2" className="Prod-comment-avatar" />
              <div className="Prod-comment-text">
                <strong>@GameCollector</strong>
                <p>Buena calidad y excelente servicio del vendedor.</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 RetroStore - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Product;