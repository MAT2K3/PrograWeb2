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

    // Verificar disponibilidad inicial
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
        if (item && item.producto.toString() === productId && item.activo) {
          itemExistente = item;
          break;
        }
      }
    }

    if (itemExistente) {
      console.log("Producto ya existe en el carrito, validando cantidad total");
      
      // VALIDACIÓN CLAVE: Verificar que la cantidad total no exceda los disponibles
      const cantidadTotal = itemExistente.cantidad + parseInt(cantidad);
      
      if (producto.disponibles && cantidadTotal > producto.disponibles) {
        return res.status(400).json({ 
          message: `No puedes agregar ${cantidad} unidades. Ya tienes ${itemExistente.cantidad} en el carrito y solo hay ${producto.disponibles} disponibles. Máximo puedes agregar ${producto.disponibles - itemExistente.cantidad} más.`,
          cantidadEnCarrito: itemExistente.cantidad,
          cantidadDisponible: producto.disponibles,
          cantidadMaximaAAgregar: producto.disponibles - itemExistente.cantidad
        });
      }
      
      itemExistente.cantidad = cantidadTotal;
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

const getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const carrito = await Cart.findOne({ usuario: userId }).populate({
      path: "productos",
      match: { activo: true },
      populate: {
        path: "producto", // esto hace populate del producto dentro del CartItem
        model: "Product"
      }
    });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    res.status(200).json({ carrito });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const desactivarCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartItem.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    res.status(200).json({ message: "Item eliminado del carrito." });
  } catch (error) {
    console.error("Error al eliminar item del carrito:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

module.exports = { addToCart, getCartByUser, desactivarCartItem };