const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");
const connectDB = require('./database'); // Importa la conexión a MongoDB
const cors = require("cors");
const multer = require('multer')

const app = express();
const port = 8080;

// Conectar a la base de datos
connectDB();

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Guardar el archivo con un nombre único basado en la fecha y el nombre original del archivo
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Usamos multer para manejar archivos de imagen
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Rutas API
app.use("/api/users", userRoutes);

// Servir archivos estáticos del frontend de React
app.use(express.static(path.join(__dirname, '../client/build')));

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ message: '✅ Cliente y servidor están conectados' });
});

// Ruta para servir la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Iniciar servidor Express
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
});