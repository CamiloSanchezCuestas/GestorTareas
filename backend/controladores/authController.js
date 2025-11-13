import Usuario from "../modelos/usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registrarUsuario = async (req, res) => {
    console.log("RegistrarUsuario - req.body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente)
      return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ email, password: hashedPassword });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    console.log("LoginUsuario - req.body:", req.body);
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    console.log("Usuario encontrado:", usuario);

    if (!usuario)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, usuario: { id: usuario._id, email: usuario.email } });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
