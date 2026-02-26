const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.post('/registro', auth.registro);
router.post('/login', auth.login);

const { validarJWT } = require('../middlewares/validar-jwt');
router.get('/', validarJWT, auth.obtenerUsuario);

module.exports = router;
