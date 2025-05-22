const Review = require("../model/reseñas");
const Product = require("../model/productos");

const actualizarCalificacionPromedio = async (productId) => {
  try {
    const reviews = await Review.find({ producto: productId });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, { calificacionPromedio: 0 });
      return 0;
    }
    
    const totalCalificacion = reviews.reduce((sum, review) => sum + review.calificacion, 0);
    const promedio = totalCalificacion / reviews.length;
    const promedioRedondeado = Math.round(promedio * 10) / 10; // Redondear a 1 decimal
    
    await Product.findByIdAndUpdate(productId, { calificacionPromedio: promedioRedondeado });
    return promedioRedondeado;
  } catch (error) {
    console.error('Error al actualizar calificación promedio:', error);
    throw error;
  }
};

// Crear una nueva reseña
const crearReseña = async (req, res) => {
  try {
    const { usuario, producto, comentario, calificacion } = req.body;
    
    // Validar que todos los campos requeridos estén presentes
    if (!usuario || !producto || !comentario || !calificacion) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }
    
    // Validar que la calificación esté en el rango correcto
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ 
        message: 'La calificación debe estar entre 1 y 5' 
      });
    }
    
    // Verificar si el usuario ya dejó una reseña para este producto
    const reseñaExistente = await Review.findOne({ 
      usuario: usuario, 
      producto: producto 
    });
    
    if (reseñaExistente) {
      return res.status(400).json({ 
        message: 'Ya has dejado una reseña para este producto' 
      });
    }
    
    // Verificar que el producto existe
    const productoExiste = await Product.findById(producto);
    if (!productoExiste) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }
    
    // Crear la nueva reseña
    const nuevaReseña = new Review({
      usuario,
      producto,
      comentario,
      calificacion
    });
    
    const reseñaGuardada = await nuevaReseña.save();
    
    // Actualizar la calificación promedio del producto
    await actualizarCalificacionPromedio(producto);
    
    // Poblar los datos del usuario para la respuesta
    await reseñaGuardada.populate('usuario', 'username avatar');
    
    res.status(201).json({
      message: 'Reseña creada exitosamente',
      reseña: reseñaGuardada
    });
    
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

// Obtener todas las reseñas de un producto
const obtenerReseñasProducto = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reseñas = await Review.find({ producto: productId })
      .populate('usuario', 'username avatar')
      .sort({ fecha: -1 }); // Ordenar por fecha descendente (más recientes primero)
    
    res.status(200).json({
      reseñas,
      total: reseñas.length
    });
    
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};


module.exports = { crearReseña, obtenerReseñasProducto };