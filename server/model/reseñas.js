const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  calificacion: { type: Number, min: 1, max: 5 } // Opcional si decides usarlo
});

module.exports = mongoose.model("Review", reviewSchema);