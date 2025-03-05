const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  nombres: { type: String, required: true, unique: true },
  apellidos: { type: String, required: true },
  contra: { type: String, required: true },
  rol: { type: String, required: true },
  fecharegistro: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);