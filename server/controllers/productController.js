const Product = require("../model/productos");

const registrarProducto = async (req, res) => {
  try {
    const { title, description, price, available, platform, consoleType, user_id } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "El título es obligatorio." });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: "La descripción es obligatoria." });
    }

    if (!price || parseFloat(price) <= 0) {
      return res.status(400).json({ message: "El precio debe ser mayor que 0." });
    }

    if (!available || parseInt(available) <= 0) {
      return res.status(400).json({ message: "La cantidad disponible debe ser mayor que 0." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Se requiere una imagen." });
    }

    const fotoProducto = `/uploads/${req.file.filename}`;

    const nuevoProducto = new Product({
      nombre: title,
      descripcion: description,
      precio: parseFloat(price),
      disponibles: parseInt(available),
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
    const { user_id } = req.params;
  
    const productos = await Product.find({ publicador: user_id });
  
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos del usuario." });
  }
};

const getProductosFiltrados = async (req, res) => {
  try {
    const { nombre, fecha_inicio, fecha_fin, vendedor, plataforma } = req.query;
    let filtro = {};

    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: "i" };
    }

    if (fecha_inicio && fecha_fin) {
      filtro.fechapublicado = { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) };
    } else if (fecha_inicio) {
      filtro.fechapublicado = { $gte: new Date(fecha_inicio) };
    } else if (fecha_fin) {
      filtro.fechapublicado = { $lte: new Date(fecha_fin) };
    }

    if (vendedor) {
      filtro.publicador = vendedor;
    }

    if (plataforma) {
      filtro.plataforma = plataforma;
    }

    const productos = await Product.find(filtro);

    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos filtrados:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

const getProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findById(id).populate("publicador");
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

const incrementarCantidadDisponible = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || parseInt(cantidad) <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser un número mayor que 0." });
    }

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    producto.disponibles += parseInt(cantidad);
    
    await producto.save();

    res.status(200).json({ 
      message: `Se incrementaron ${cantidad} unidades. Nuevo stock: ${producto.disponibles}`,
      producto: producto
    });
  } catch (error) {
    console.error("Error al incrementar cantidad:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = { registrarProducto, obtenerProductosPorUsuario, getProductosFiltrados, getProductoPorId,incrementarCantidadDisponible};