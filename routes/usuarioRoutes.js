const express = require('express');
const router = express.Router();
const usuarioControllers = require('../controllers/usuarioControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId, validarEmail } = require('../helpers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');

// Todas las rutas de usuarios requieren autenticación
router.use(validarJWT);

router.get('/', usuarioControllers.getAllUsuarios);
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuarioControllers.getUsuarioById);
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('nombre', 'El nombre es obligatorio').optional().not().isEmpty().trim(),
  check('email', 'El email no es válido').optional().isEmail().normalizeEmail(),
  check('email').optional().custom(validarEmail),
  check('fecha_nacimiento', 'Formato de fecha inválido').optional().isISO8601().toDate(),
  validarCampos
], usuarioControllers.updateUsuario);
router.patch('/:id/estado', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('estado', 'El estado es obligatorio').not().isEmpty().isIn(['activo', 'inactivo']),
  validarCampos
], usuarioControllers.updateEstadoUsuario);
router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuarioControllers.deleteUsuario);

module.exports = router;
