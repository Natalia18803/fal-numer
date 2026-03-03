const validarEstado = (req, res, next) => {
    // El usuario ya fue injectado por validarJWT en req.usuario
    if (!req.usuario) {
        return res.status(500).json({ 
            error: 'Se requiere validar el token primero' 
        });
    }

    // Verificar si el usuario tiene estado activo (ha pagado)
    if (req.usuario.estado !== 'activo') {
        return res.status(403).json({ 
            error: 'Acceso denegado. Debe realizar el pago para acceder a esta función' 
        });
    }

    next();
};

module.exports = { validarEstado };
