const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const { body } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// POST /api/auth/registro - Registrar nuevo usuario (PÚBLICO - no requiere token)
// Temporalmente sin validaciones para diagnosticar el error "next is not a function"
router.post('/registro', authControllers.registro);

// POST /api/auth/login - Login de usuario (PÚBLICO - no requiere token)
// Temporalmente sin validaciones para diagnosticar el error "next is not a function"
router.post('/login', authControllers.login);


// GET /api/auth - Obtener usuario autenticado (PROTEGIDO - requiere token)
router.get('/', validarJWT, authControllers.obtenerUsuario);

module.exports = router;
