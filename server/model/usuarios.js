const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nombres: { type: String, required: true},
  apllpat: { type: String, required: true },
  apllmat: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contra: { type: String, required: true },
  fechanacimiento: { type: Date, required: true },
  avatar: { type: String, required: true },
  extension: { type: String, required: true },
  rol: { type: String, required: true },
  fecharegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);