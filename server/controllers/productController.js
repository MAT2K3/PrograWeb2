const Product = require("../model/productos");

const registrarProducto = async (req, res) => {
  try {
    const { title, description, platform, consoleType, user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Se requiere una imagen." });
    }

    const fotoProducto = `/uploads/${req.file.filename}`;

    const nuevoProducto = new Product({
      nombre: title,
      descripcion: description,
      plataforma: platform,
      tipoconsola: consoleType,
      foto: fotoProducto,
      publicador: user_id
    });

    await nuevoProducto.save();
    res.status(201).json({ message: "Producto publicado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al publicar producto." });
  }
};

const obtenerProductosPorUsuario = async (req, res) => {
    try {
      const { user_id } = req.params; // lo recibiremos por params
  
      const productos = await Product.find({ publicador: user_id });
  
      res.status(200).json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener productos del usuario." });
    }
  };

module.exports = { registrarProducto, obtenerProductosPorUsuario };