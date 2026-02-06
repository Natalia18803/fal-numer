require('dotenv').config();
const express = require('express');
const { conectarMongo } = require('./database/cnx-mongo')

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
conectarMongo();

// Rutas
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/pagos', require('./routes/pagoRoutes'));
app.use('/api/lecturas', require('./routes/lecturaRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Numerología funcionando');
});

// Ruta de health check para verificar conexión a la base de datos
app.get('/api/health', async (req, res) => {
    try {
        const { getClient } = require('./database/cnx-mongo');
        const client = getClient();
        if (client && client.topology && client.topology.isConnected()) {
            res.status(200).json({ status: 'OK', message: 'Base de datos conectada' });
        } else {
            res.status(500).json({ status: 'ERROR', message: 'Base de datos no conectada' });
        }
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Error verificando conexión a la base de datos' });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
