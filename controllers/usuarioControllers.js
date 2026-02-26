const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

// Helper para generar el Token (Asegúrate de tener JWT_SECRET en tu .env)
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto-temporal', {
        expiresIn: '30d'
    });
};

// --- RUTAS DE AUTENTICACIÓN ---

exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento } = req.body;

        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const usuario = new Usuario({ nombre, email, password, fecha_nacimiento });
        await usuario.save();

        const token = generarToken(usuario._id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            usuario: { id: usuario._id, nombre, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || !(await usuario.compararPassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generarToken(usuario._id);
        res.json({
            message: 'Login exitoso',
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- RUTAS DE GESTIÓN (CRUD) ---

exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password'); // No enviamos el password por seguridad
        res.json({ usuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email, fecha_nacimiento } = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id, 
            { nombre, email, fecha_nacimiento },
            { new: true }
        );
        res.json({ message: 'Usuario actualizado', usuario: usuarioActualizado });
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