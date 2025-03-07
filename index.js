const mongoose = require('mongoose');
const uri = 'mongodb://useradmin:grupo52PW2_AD2024@xorgx11.com:27017/DATABASE?authSource=admin&readPreference=primary&ssl=false';
const express = require('express'); 
const app = express(); 
const port = 8080;
const bodyParser = require('body-parser'); //Middleware para procesar datos de formularios y json

mongoose.connect(uri)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');

    app.use(bodyParser.json()); //Permite procesar datos json en las peticiones
    app.use(bodyParser.urlencoded({ extended: true })); //Permite recibir datos de formularios html

    //Ruta simple para comprobar
    app.get('/', (req, res) => {
      res.send('Si jala omaigod');
    });

    //Inicio del servidor Express
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar a MongoDB:', error);
  });