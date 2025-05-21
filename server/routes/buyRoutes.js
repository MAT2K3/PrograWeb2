const express = require("express");
const buyController = require("../controllers/buyController");

const router = express.Router();

router.post("/buy", buyController.crearCompra);

module.exports = router;