const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const { check } = require('express-validator');

// Middlewares y Helpers
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId, validarEmail } = require('../helpers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');

// ==========================================
//  RUTAS PÚBLICAS (No requieren Token)
// ==========================================

// Registro de usuario - SIN validaciones temporalemente para diagnosticar
router.post('/registro', usuarioControllers.registro);

// Login de usuario - SIN validaciones temporalemente para diagnosticar  
router.post('/login', usuarioControllers.login);


// ==========================================
//  RUTAS PRIVADAS (Requieren validarJWT)
// ==========================================

// A partir de aquí, todas las rutas pasan por la validación de Token
router.use(validarJWT);

// Obtener todos los usuarios
router.get('/', usuarioControllers.getAllUsuarios);

// Obtener usuario por ID
router.get('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
    usuarioControllers.getUsuarioById
);

// Actualizar usuario
router.put('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty().trim(),
    check('email', 'El email no es válido').optional().isEmail().normalizeEmail(),
    check('fecha_nacimiento', 'Formato de fecha inválido').optional().isISO8601().toDate(),
    validarCampos,
    usuarioControllers.updateUsuario
);

// Actualizar estado del usuario
router.patch('/:id/estado', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('estado', 'El estado es obligatorio').not().isEmpty().isIn(['activo', 'inactivo']),
    validarCampos,
    usuarioControllers.updateEstadoUsuario
);

// Eliminar usuario
router.delete('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
    usuarioControllers.deleteUsuario
);

module.exports = router;
