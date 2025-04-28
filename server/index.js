const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./database");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 8080;

connectDB();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.use(express.static(path.join(__dirname, "../client/public")));
app.use("/uploads", express.static("uploads"));

app.get("/api/status", (req, res) => {
  res.json({ message: "✅ Cliente y servidor están conectados" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
});