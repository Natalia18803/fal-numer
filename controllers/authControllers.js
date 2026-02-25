const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto-temporal', {
        expiresIn: '30d'
    });
};

// Registro de usuario
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear usuario (el password se encripta automáticamente en el modelo)
        const usuario = new Usuario({
            nombre,
            email,
            password,
            fecha_nacimiento
        });

        await usuario.save();

        // Generar token
        const token = generarToken(usuario._id);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                estado: usuario.estado
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar que se envíen credenciales
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son requeridos' });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar password
        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = generarToken(usuario._id);

        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                estado: usuario.estado
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuario autenticado
exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
