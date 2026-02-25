const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

// POST /api/auth/registro - Registrar nuevo usuario
router.post('/registro', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validarCampos
], authControllers.registro);

// POST /api/auth/login - Login de usuario
router.post('/login', [
    check('email', 'El email no es válido').isEmail().normalizeEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], authControllers.login);

// GET /api/auth - Obtener usuario autenticado (protegido)
const { validarJWT } = require('../middlewares/validar-jwt');
router.get('/', validarJWT, authControllers.obtenerUsuario);

module.exports = router;
