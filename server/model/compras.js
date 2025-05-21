const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      cantidad: { type: Number, required: true, min: 1 },
      precioUnitario: { type: Number, required: true },
      vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    }
  ],
  metodoPago: { type: String, required: true },
  direccionEnvio: { type: String, required: true },
  telefonoContacto: { type: String, required: true },
  total: { type: Number, required: true },
  fechaCompra: { type: Date, default: Date.now },
  estado: { type: String, default: "pendiente" }
});

module.exports = mongoose.model("Compra", compraSchema);