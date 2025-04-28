const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true},
  plataforma: { type: String, required: true },
  tipoconsola: { type: String, required: true },
  foto: { type: String, required: true, unique: true },
  publicador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fechapublicado: { type: Date, default: Date.now  },
  estatus: { type: Boolean, default: true }
});

module.exports = mongoose.model("Product", productSchema);