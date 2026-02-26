const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {
    // 1. Obtener el token del header
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({ 
            error: 'No hay token en la petición' 
        });
    }

    try {
        // 2. Verificar el token
        const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secreto-temporal');
        
        // 3. Buscar el usuario en la BD
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(401).json({ 
                error: 'Token no válido - usuario no existe en BD' 
            });
        }

        // 4. Verificar si el usuario está activo (opcional)
        if (usuario.estado === 'inactivo') {
            return res.status(401).json({ 
                error: 'Token no válido - usuario con estado inactivo' 
            });
        }

        // 5. Inyectar la información del usuario en la petición
        req.usuario = usuario;
        
        // ¡Crucial! Sin esto, la petición se queda "colgada"
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ 
            error: 'Token no válido o expirado' 
        });
    }
};

module.exports = { validarJWT };