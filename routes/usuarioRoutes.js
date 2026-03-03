const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const { check } = require('express-validator');

// Middlewares y Helpers
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId, validarEmail } = require('../helpers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol');

// ==========================================
//  RUTAS PÚBLICAS (No requieren Token)
// ==========================================

// Registro de usuario
router.post('/registro', usuarioControllers.registro);

// Login de usuario
router.post('/login', usuarioControllers.login);


// ==========================================
//  RUTAS PRIVADAS (Requieren validarJWT)
// ==========================================

// A partir de aquí, todas las rutas pasan por la validación de Token
router.use(validarJWT);

// ==========================================
//  RUTAS DE USUARIOS - SOLO ADMIN
// ==========================================

// Obtener todos los usuarios - Solo admin
router.get('/', validarRol('admin'), usuarioControllers.getAllUsuarios);

// Actualizar estado del usuario - Solo admin
router.patch('/:id/estado', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('estado', 'El estado es obligatorio').not().isEmpty().isIn(['activo', 'inactivo']),
    validarCampos,
    validarRol('admin'),
    usuarioControllers.updateEstadoUsuario
);

// Eliminar usuario - Solo admin
router.delete('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
    validarRol('admin'),
    usuarioControllers.deleteUsuario
);


// ==========================================
//  RUTAS DE USUARIOS - USUARIO Y ADMIN
// ==========================================

// Obtener usuario por ID - Propio usuario o admin
router.get('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
    usuarioControllers.getUsuarioById
);

// Actualizar usuario - Propio usuario o admin
router.put('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').optional().not().isEmpty().trim(),
    check('email', 'El email no es válido').optional().isEmail().normalizeEmail(),
    check('fecha_nacimiento', 'Formato de fecha inválido').optional().isISO8601().toDate(),
    validarCampos,
    usuarioControllers.updateUsuario
);

module.exports = router;
