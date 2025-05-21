const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCartByUser);
router.put("/:id/eliminar", cartController.desactivarCartItem);

module.exports = router;