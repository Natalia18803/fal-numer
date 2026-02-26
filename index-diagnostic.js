require('dotenv').config();
const express = require('express');
const { conectarMongo } = require('./database/cnx-mongo');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
conectarMongo();

// Ruta de prueba directa SIN usar router externo
app.post('/api/auth/registro-directo', async (req, res) => {
    try {
        const Usuario = require('./models/usuario');
        const jwt = require('jsonwebtoken');
        
        const { nombre, email, password, fecha_nacimiento } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear usuario
        const usuario = new Usuario({
            nombre,
            email,
            password,
            fecha_nacimiento
        });

        await usuario.save();

        // Generar token
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET || 'secreto-temporal', {
            expiresIn: '30d'
        });

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
});

// Ahora probar con el router de auth
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Puerto del servidor
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor de diagnóstico corriendo en http://localhost:${PORT}`);
    console.log('Prueba la ruta directa: POST http://localhost:3001/api/auth/registro-directo');
    console.log('Prueba la ruta con router: POST http://localhost:3001/api/auth/registro');
});
