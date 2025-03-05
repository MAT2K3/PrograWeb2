const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/test';
const express = require('express'); const app = express(); const port = 8080;
const bodyParser = require('body-parser');
// support parsing of application/json type post data
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión exitosa a MongoDB');
  
  //Configuración de bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //Ruta simple para comprobar
  app.get('/', (req, res) => {
    res.send('Si jala omaigod');
  });

  // Inicio del servidor Express
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
})
.catch(error => {
  console.error('Error al conectar a MongoDB:', error);
});