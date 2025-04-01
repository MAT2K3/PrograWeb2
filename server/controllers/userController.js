const User = require("../model/usuarios");

const registerUser = async (req, res) => {
  try {
    const { username, nombres, apllpat, apllmat, correo, contra, fechanacimiento, rol } = req.body;

    // Extraer el archivo subido por multer
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const extension = req.file ? req.file.mimetype.split("/")[1] : null;

    if (!username || !correo || !contra || !fechanacimiento || !rol) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser enviados." });
    }

    const newUser = new User({
      username,
      nombres,
      apllpat,
      apllmat,
      correo,
      contra,
      fechanacimiento,
      rol,
      avatar,
      extension,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("🚨 Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = { registerUser };