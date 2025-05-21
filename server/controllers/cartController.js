const Cart = require("../model/carritos");
const CartItem = require("../model/carritoitems");
const Product = require("../model/productos");

const addToCart = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Depuración para ver qué datos llegan
    const { userId, productId, cantidad } = req.body;

    if (!userId || !productId || !cantidad) {
      console.log("Datos faltantes:", { userId, productId, cantidad });
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Validar que el producto exista
    const producto = await Product.findById(productId);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Verificar disponibilidad (si tienes un campo disponibles)
    if (producto.disponibles && cantidad > producto.disponibles) {
      return res.status(400).json({ message: "No hay suficientes unidades disponibles." });
    }

    // Buscar o crear el carrito del usuario
    let carrito = await Cart.findOne({ usuario: userId });
    if (!carrito) {
      carrito = new Cart({ usuario: userId, productos: [] });
      await carrito.save(); // Guardar el carrito vacío
      console.log("Carrito nuevo creado para el usuario:", userId);
    }

    // Verificar si el producto ya está en el carrito
    let itemExistente = null;
    
    // Si el carrito tiene productos, verificar cada uno
    if (carrito.productos && carrito.productos.length > 0) {
      for (const itemId of carrito.productos) {
        const item = await CartItem.findById(itemId);
        if (item && item.producto.toString() === productId) {
          itemExistente = item;
          break;
        }
      }
    }

    if (itemExistente) {
      console.log("Producto ya existe en el carrito, actualizando cantidad");
      itemExistente.cantidad += parseInt(cantidad);
      await itemExistente.save();
    } else {
      console.log("Agregando nuevo producto al carrito");
      const nuevoItem = new CartItem({
        producto: productId,
        cantidad: parseInt(cantidad),
      });
      const savedItem = await nuevoItem.save();
      carrito.productos.push(savedItem._id);
    }

    carrito.actualizado = Date.now();
    await carrito.save();

    return res.status(200).json({ 
      message: "Producto agregado al carrito con éxito.",
      carrito: {
        _id: carrito._id,
        cantidadItems: carrito.productos.length
      }
    });

  } catch (error) {
    console.error("🚨 Error al agregar al carrito:", error);
    return res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};
module.exports = { addToCart };