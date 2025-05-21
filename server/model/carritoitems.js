const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  cantidad: { type: Number, required: true, min: 1 }
});

module.exports = mongoose.model("CartItem", cartItemSchema);