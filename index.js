require('dotenv').config();
const express = require('express');
const { conectarMongo } = require('./database/cnx-mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/usuario');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
conectarMongo();

// Helper para generar token
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto-temporal', {
        expiresIn: '30d'
    });
};

// ==========================================
//  RUTAS DE AUTENTICACION (SIN TOKEN)
// ==========================================

// POST /api/auth/registro - Registrar nuevo usuario (SIN TOKEN)
app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre, email, password, fecha_nacimiento } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya esta registrado' });
        }

        // Encriptar password manualmente (sin hook pre-save)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const usuario = new Usuario({
            nombre,
            email,
            password: hashedPassword,
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
        console.error('Error en registro:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login - Login de usuario (SIN TOKEN)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar que se envien credenciales
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son requeridos' });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        // Verificar password
        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
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
});

// ==========================================
//  RUTAS PROTEGIDAS (CON TOKEN)
// ==========================================

const { validarJWT } = require('./middlewares/validar-jwt');

// GET /api/auth - Obtener usuario autenticado (protegido)
app.get('/api/auth', validarJWT, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Otras rutas
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/pagos', require('./routes/pagoRoutes'));
app.use('/api/lecturas', require('./routes/lecturaRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Numerologia funcionando - Registro sin token requerido');
});

// Ruta de health check
app.get('/api/health', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const state = mongoose.connection.readyState;
        if (state === 1) {
            res.status(200).json({ status: 'OK', message: 'Base de datos conectada' });
        } else {
            res.status(500).json({ status: 'ERROR', message: 'Base de datos no conectada' });
        }
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Error verificando conexion' });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('');
    console.log('RUTAS PUBLICAS (sin token):');
    console.log('  POST /api/auth/registro - Registro de usuario');
    console.log('  POST /api/auth/login    - Login de usuario');
    console.log('');
    console.log('RUTAS PROTEGIDAS (con token):');
    console.log('  GET  /api/auth          - Obtener usuario autenticado');
    console.log('  /api/usuarios/*         - Rutas de usuarios');
    console.log('  /api/pagos/*            - Rutas de pagos');
    console.log('  /api/lecturas/*         - Rutas de lecturas');
});
