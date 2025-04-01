const express = require("express");
const multer = require("multer");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para registrar usuarios con subida de imagen
router.post("/register", upload.single("avatar"), registerUser);

module.exports = router;