const mongoose = require('mongoose');
const express = require('express'); 
const path = require('path'); // IMPORTANTE: Asegura que path está incluido
const bodyParser = require('body-parser');

const app = express(); 
const port = 8080;

const uri = 'mongodb://useradmin:grupo52PW2_AD2024@xorgx11.com:27017/DATABASE?authSource=admin&readPreference=primary&ssl=false';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB');

    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: true })); 

    // Servir archivos estáticos del frontend de React
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Ruta de prueba para verificar la conexión entre frontend y backend
    app.get('/api/status', (req, res) => {
      res.json({ message: '✅ Cliente y servidor están conectados' });
    });

    // Ruta para servir la aplicación React en cualquier otra ruta
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });

    // Iniciar servidor Express
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar a MongoDB:', error);
  });