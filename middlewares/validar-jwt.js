const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.header('x-token');
        
        if (!token) {
            return res.status(401).json({ error: 'No hay token en la petición' });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto-temporal');
        
        // Obtener usuario del token
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(401).json({ error: 'Token no válido - usuario no existe' });
        }

        // Agregar usuario a la request
        req.usuario = {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            estado: usuario.estado
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token no válido' });
    }
};

module.exports = { validarJWT };
