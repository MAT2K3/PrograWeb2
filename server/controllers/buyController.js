const Buy = require("../model/compras");
const Cart = require("../model/carritos");
const CartItem = require("../model/carritoitems");
const Product = require("../model/productos");

const crearCompra = async (req, res) => {
  try {
    const { userId, metodoPago, direccionEnvio, telefonoContacto } = req.body;

    if (!userId || !metodoPago || !direccionEnvio || !telefonoContacto) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const carrito = await Cart.findOne({ usuario: userId }).populate({
      path: "productos",
      match: { activo: true },
      populate: { path: "producto", model: "Product" }
    });

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    const productosCompra = carrito.productos.map(item => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
      vendedor: item.producto.publicador
    }));

    const total = productosCompra.reduce(
      (acc, item) => acc + item.cantidad * item.precioUnitario,
      0
    );

    const nuevaCompra = new Buy({
      comprador: userId,
      productos: productosCompra,
      metodoPago,
      direccionEnvio,
      telefonoContacto,
      total
    });

    await nuevaCompra.save();

    await Promise.all(carrito.productos.map(async item => {
      const producto = item.producto;

      if (producto) {
        producto.disponibles -= item.cantidad;
        if (producto.disponibles < 0) producto.disponibles = 0;
        await producto.save();
      }

      item.activo = false;
      await item.save();
    }));

    res.status(200).json({ message: "Compra realizada con éxito." });

  } catch (error) {
    console.error("❌ Error al crear la compra:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const obtenerVentasPorVendedor = async (req, res) => {
  try {
    const { vendedorId } = req.params;

    const compras = await Buy.find({ "productos.vendedor": vendedorId })
      .populate("comprador", "username")
      .populate("productos.producto", "nombre foto");

    const ventas = [];

    compras.forEach(compra => {
      compra.productos.forEach(prod => {
        if (prod.vendedor.toString() === vendedorId) {
          ventas.push({
            producto: {
              nombre: prod.producto.nombre,
              foto: prod.producto.foto
            },
            comprador: compra.comprador,
            cantidad: prod.cantidad,
            precioUnitario: prod.precioUnitario,
            metodoPago: compra.metodoPago,
            fechaCompra: compra.fechaCompra,
            estado: compra.estado
          });
        }
      });
    });

    res.status(200).json({ ventas });
  } catch (error) {
    console.error("❌ Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const obtenerComprasPorComprador = async (req, res) => {
  try {
    const { compradorId } = req.params;

    const compras = await Buy.find({ comprador: compradorId })
      .populate({
        path: "productos.producto",
        select: "nombre foto"
      })
      .populate({
        path: "productos.vendedor", 
        select: "username"
      })
      .sort({ fechaCompra: -1 });

    const historialCompras = [];

    compras.forEach(compra => {
      compra.productos.forEach(prod => {
        historialCompras.push({
          _id: `${compra._id}_${prod.producto._id}`,
          nombreProducto: prod.producto.nombre,
          fotoProducto: prod.producto.foto,
          nombreVendedor: prod.vendedor.username,
          fechaCompra: compra.fechaCompra,
          cantidad: prod.cantidad,
          precioUnitario: prod.precioUnitario,
          totalProducto: prod.cantidad * prod.precioUnitario,
          metodoPago: compra.metodoPago,
          estado: compra.estado
        });
      });
    });

    res.status(200).json({ compras: historialCompras });
  } catch (error) {
    console.error("❌ Error al obtener las compras:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const obtenerTodasLasCompras = async (req, res) => {
  try {
    const compras = await Buy.find({})
      .populate({
        path: "productos.producto",
        select: "nombre foto"
      })
      .populate({
        path: "productos.vendedor", 
        select: "username"
      })
      .populate({
        path: "comprador",
        select: "username"
      })
      .sort({ fechaCompra: -1 });

    const todasLasCompras = [];

    compras.forEach(compra => {
      compra.productos.forEach(prod => {
        todasLasCompras.push({
          _id: `${compra._id}_${prod.producto._id}`,
          compraId: compra._id,
          nombreProducto: prod.producto.nombre,
          fotoProducto: prod.producto.foto,
          nombreVendedor: prod.vendedor.username,
          nombreComprador: compra.comprador.username,
          fechaCompra: compra.fechaCompra,
          cantidad: prod.cantidad,
          precioUnitario: prod.precioUnitario,
          totalProducto: prod.cantidad * prod.precioUnitario,
          metodoPago: compra.metodoPago,
          direccionEnvio: compra.direccionEnvio,
          telefonoContacto: compra.telefonoContacto,
          estado: compra.estado
        });
      });
    });

    res.status(200).json({ compras: todasLasCompras });
  } catch (error) {
    console.error("❌ Error al obtener todas las compras:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const actualizarEstadoCompra = async (req, res) => {
  try {
    const { compraId } = req.params;
    const { nuevoEstado } = req.body;

    const estadosValidos = ["Pendiente", "En camino", "Entregado", "Cancelado"];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ message: "Estado inválido." });
    }

    const compra = await Buy.findByIdAndUpdate(
      compraId,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada." });
    }

    res.status(200).json({ 
      message: "Estado actualizado correctamente.",
      nuevoEstado: nuevoEstado
    });
  } catch (error) {
    console.error("❌ Error al actualizar el estado:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

module.exports = { crearCompra, obtenerVentasPorVendedor, obtenerComprasPorComprador, obtenerTodasLasCompras, actualizarEstadoCompra };