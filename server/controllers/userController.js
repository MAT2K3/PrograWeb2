const User = require("../model/usuarios");

const registerUser = async (req, res) => {
  try {
    const { username, nombres, apllpat, apllmat, correo, contra, fechanacimiento, rol } = req.body;

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

const loginUser = async (req, res) => {
  try {
    const { usuario, contra } = req.body;

    if (!usuario || !contra) {
      return res.status(400).json({ message: "Se requieren el usuario y la contraseña" });
    }

    // Busca por el campo `username` que tú estás usando
    const user = await User.findOne({ username: usuario });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verifica la contraseña (esto es sin hash, cuidado en producción)
    if (user.contra !== contra) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        username: user.username,
        rol: user.rol,
        nombres: user.nombres,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
}; 

module.exports = { registerUser, loginUser };