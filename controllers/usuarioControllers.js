const Usuario = require('../models/usuario');

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({usuarios});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, fecha_nacimiento } = req.body;
    const usuario = new Usuario({ nombre, email, fecha_nacimiento });
    await usuario.save();
    res.status(201).json({ id: usuario._id, message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const { nombre, email, fecha_nacimiento } = req.body;
    await Usuario.findByIdAndUpdate(req.params.id, { nombre, email, fecha_nacimiento });
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEstadoUsuario = async (req, res) => {
  try {
    const { estado } = req.body;
    await Usuario.findByIdAndUpdate(req.params.id, { estado });
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
