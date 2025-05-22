const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.post("/crear", reviewController.crearReseña);
router.get("/producto/:productId", reviewController.obtenerReseñasProducto);

module.exports = router;