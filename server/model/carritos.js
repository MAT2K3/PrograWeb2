const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  actualizado: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);