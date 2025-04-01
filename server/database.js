const mongoose = require('mongoose');

const uri = 'mongodb://useradmin:grupo52PW2_AD2024@xorgx11.com:27017/LosReales?authSource=admin&readPreference=primary&ssl=false';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); // Detiene la ejecución si hay error
  }
};

module.exports = connectDB;