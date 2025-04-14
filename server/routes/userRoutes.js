const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");

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

router.post("/register", upload.single("avatar"), userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;