const User = require("../model/usuarios");
const Cart = require("../model/carritos");

const validarContrasena = (password) => {
  const requisitos = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password),
    especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const esValida = Object.values(requisitos).every(req => req);
  return { esValida, requisitos };
};

const validarFechaNacimiento = (fecha) => {
  const fechaNac = new Date(fecha);
  const hoy = new Date();
  const hace100Anos = new Date();
  hace100Anos.setFullYear(hoy.getFullYear() - 100);

  hoy.setHours(0, 0, 0, 0);
  fechaNac.setHours(0, 0, 0, 0);

  if (fechaNac >= hoy) {
    return { esValida: false, mensaje: "La fecha de nacimiento no puede ser hoy o en el futuro." };
  }

  if (fechaNac < hace100Anos) {
    return { esValida: false, mensaje: "La fecha de nacimiento no puede ser de hace más de 100 años." };
  }

  return { esValida: true };
};

const registerUser = async (req, res) => {
  try {
    const { username, nombres, apllpat, apllmat, correo, contra, fechanacimiento, rol } = req.body;

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const extension = req.file ? req.file.mimetype.split("/")[1] : null;

    if (!username || !nombres || !apllpat || !apllmat || !correo || !contra || !fechanacimiento || !rol) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben ser enviados." });
    }

    const campos = { username, nombres, apllpat, apllmat, correo, contra, rol };
    for (const [campo, valor] of Object.entries(campos)) {
      if (!valor.toString().trim()) {
        return res.status(400).json({ 
          message: `El campo ${campo === 'apllpat' ? 'apellido paterno' : 
                                campo === 'apllmat' ? 'apellido materno' : 
                                campo} no puede estar vacío.` 
        });
      }
    }

    if (!avatar) {
      return res.status(400).json({ message: "Debes seleccionar una imagen de perfil." });
    }

    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
    }

    const existingEmail = await User.findOne({ correo: correo.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
    }

    const { esValida: passwordValida, requisitos } = validarContrasena(contra);
    if (!passwordValida) {
      let mensajeError = "La contraseña debe cumplir con los siguientes requisitos: ";
      const faltantes = [];
      
      if (!requisitos.longitud) faltantes.push("mínimo 8 caracteres");
      if (!requisitos.mayuscula) faltantes.push("al menos 1 letra mayúscula");
      if (!requisitos.minuscula) faltantes.push("al menos 1 letra minúscula");
      if (!requisitos.numero) faltantes.push("al menos 1 número");
      if (!requisitos.especial) faltantes.push("al menos 1 carácter especial");
      
      mensajeError += faltantes.join(", ") + ".";
      return res.status(400).json({ message: mensajeError });
    }

    const { esValida: fechaValida, mensaje: mensajeFecha } = validarFechaNacimiento(fechanacimiento);
    if (!fechaValida) {
      return res.status(400).json({ message: mensajeFecha });
    }

    if (!['comprador', 'vendedor'].includes(rol.toLowerCase())) {
      return res.status(400).json({ message: "El rol debe ser 'comprador' o 'vendedor'." });
    }

    const newUser = new User({
      username: username.trim(),
      nombres: nombres.trim(),
      apllpat: apllpat.trim(),
      apllmat: apllmat.trim(),
      correo: correo.trim().toLowerCase(),
      contra,
      fechanacimiento,
      rol: rol.toLowerCase(),
      avatar,
      extension,
    });

    const savedUser = await newUser.save();

    if (rol.toLowerCase() === "comprador") {
      const newCart = new Cart({
        usuario: savedUser._id,
        productos: []
      });

      await newCart.save();
    }
    
    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (error) {
    console.error("🚨 Error en el servidor:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const fieldName = field === 'username' ? 'nombre de usuario' : 
                        field === 'correo' ? 'correo electrónico' : field;
      return res.status(400).json({ message: `El ${fieldName} ya está en uso.` });
    }
    
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { usuario, contra } = req.body;

    if (!usuario || !contra) {
      return res.status(400).json({ message: "Se requieren el usuario y la contraseña" });
    }

    const user = await User.findOne({ username: usuario });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

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
      nombres,
      apllpat,
      apllmat,
      contra,
      fechanacimiento,
    } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Datos recibidos para actualizar:");
    console.log({
      nombres,
      apllpat,
      apllmat,
      contra,
      fechanacimiento,
    });

    const campos = { nombres: 'Nombre', apllpat: 'Apellido Paterno', apllmat: 'Apellido Materno', contra: 'Contraseña', fechanacimiento: 'Fecha de Nacimiento' };
    
    for (const [campo, nombre] of Object.entries(campos)) {
      const valor = req.body[campo];
      if (!valor || !valor.toString().trim()) {
        return res.status(400).json({ 
          message: `El campo ${nombre} no puede estar vacío.` 
        });
      }
    }

    const { esValida: passwordValida, requisitos } = validarContrasena(contra);
    if (!passwordValida) {
      let mensajeError = "La contraseña debe cumplir con los siguientes requisitos: ";
      const faltantes = [];
      
      if (!requisitos.longitud) faltantes.push("mínimo 8 caracteres");
      if (!requisitos.mayuscula) faltantes.push("al menos 1 letra mayúscula");
      if (!requisitos.minuscula) faltantes.push("al menos 1 letra minúscula");
      if (!requisitos.numero) faltantes.push("al menos 1 número");
      if (!requisitos.especial) faltantes.push("al menos 1 carácter especial");
      
      mensajeError += faltantes.join(", ") + ".";
      return res.status(400).json({ message: mensajeError });
    }

    const { esValida: fechaValida, mensaje: mensajeFecha } = validarFechaNacimiento(fechanacimiento);
    if (!fechaValida) {
      return res.status(400).json({ message: mensajeFecha });
    }

    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const extension = req.file ? req.file.mimetype.split("/")[1] : undefined;

    const updatedFields = {
      nombres: nombres.trim(),
      apllpat: apllpat.trim(),
      apllmat: apllmat.trim(),
      contra,
      fechanacimiento,
    };

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