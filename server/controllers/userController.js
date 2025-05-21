const User = require("../model/usuarios");
const Cart = require("../model/carritos");

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

    const savedUser = await newUser.save();

    if (rol === "comprador") {
      const newCart = new Cart({
        usuario: savedUser._id,
        productos: []
      });

      await newCart.save();
    }
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
        correo: user.correo,
        contra: user.contra,
        apllpat: user.apllpat,
        apllmat: user.apllmat,
        fechanacimiento: user.fechanacimiento,
        avatar: user.avatar,
        extension: user.extension,
        fecharegistro: user.fecharegistro
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
}; 

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      username,
      nombres,
      apllpat,
      apllmat,
      correo,
      contra,
      fechanacimiento,
    } = req.body;

    // Verificar qué datos estamos recibiendo
    console.log("Datos recibidos para actualizar:");
    console.log({
      username,
      nombres,
      apllpat,
      apllmat,
      correo,
      contra,
      fechanacimiento,
    });

    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const extension = req.file ? req.file.mimetype.split("/")[1] : undefined;

    const updatedFields = {
      username,
      nombres,
      apllpat,
      apllmat,
      correo,
      contra,
      fechanacimiento,
    };

    // Solo actualiza el avatar si se subió uno nuevo
    if (avatar) {
      updatedFields.avatar = avatar;
      updatedFields.extension = extension;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error actualizando usuario:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

const getVendedores = async (req, res) => {
  try {
    const vendedores = await User.find({ rol: "vendedor" }).select("username _id");
    res.status(200).json(vendedores);
  } catch (error) {
    console.error("❌ Error al obtener vendedores:", error);
    res.status(500).json({ message: "Error al obtener los vendedores", error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUser, getVendedores };