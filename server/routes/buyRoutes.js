const express = require("express");
const buyController = require("../controllers/buyController");

const router = express.Router();

router.post("/buy", buyController.crearCompra);
router.get("/hists/:vendedorId", buyController.obtenerVentasPorVendedor);
router.get("/histc/:compradorId", buyController.obtenerComprasPorComprador);

module.exports = router;