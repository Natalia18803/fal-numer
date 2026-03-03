const validarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        // El usuario ya fue injectado por validarJWT en req.usuario
        if (!req.usuario) {
            return res.status(500).json({ 
                error: 'Se requiere validar el token primero' 
            });
        }

        // Verificar si el rol del usuario está en los roles permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                error: `Acceso denegado. Se requiere uno de los roles: ${rolesPermitidos.join(', ')}` 
            });
        }

        next();
    };
};

module.exports = { validarRol };
