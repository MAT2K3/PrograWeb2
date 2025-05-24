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
    const promedioRedondeado = Math.round(promedio * 10) / 10;
    
    await Product.findByIdAndUpdate(productId, { calificacionPromedio: promedioRedondeado });
    return promedioRedondeado;
  } catch (error) {
    console.error('Error al actualizar calificación promedio:', error);
    throw error;
  }
};

const crearReseña = async (req, res) => {
  try {
    const { usuario, producto, comentario, calificacion } = req.body;
    
    if (!usuario || !producto || !comentario || !calificacion) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }
    
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ 
        message: 'La calificación debe estar entre 1 y 5' 
      });
    }
    
    const reseñaExistente = await Review.findOne({ 
      usuario: usuario, 
      producto: producto 
    });
    
    if (reseñaExistente) {
      return res.status(400).json({ 
        message: 'Ya has dejado una reseña para este producto' 
      });
    }
    
    const productoExiste = await Product.findById(producto);
    if (!productoExiste) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }
    
    const nuevaReseña = new Review({
      usuario,
      producto,
      comentario,
      calificacion
    });
    
    const reseñaGuardada = await nuevaReseña.save();
    
    await actualizarCalificacionPromedio(producto);
    
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

const obtenerReseñasProducto = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reseñas = await Review.find({ producto: productId })
      .populate('usuario', 'username avatar')
      .sort({ fecha: -1 });
    
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