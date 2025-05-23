const express = require("express");
const multer = require("multer");
const productController = require("../controllers/productController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/publish", upload.single("image"), productController.registrarProducto);
router.get("/getposts/:user_id", productController.obtenerProductosPorUsuario);
router.get("/buscar", productController.getProductosFiltrados);
router.get('/:id', productController.getProductoPorId);
router.put('/increment/:id', productController.incrementarCantidadDisponible);

module.exports = router;