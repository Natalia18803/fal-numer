const express = require('express');
const router = express.Router();
const pagoControllers = require('../controllers/pagoControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId } = require('../helpers/usuario');

router.get('/', pagoControllers.getAllPagos);
router.get('/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos
], pagoControllers.getPagosByUsuario);

router.post('/', [
  check('usuario_id', 'Usuario ID es obligatorio').not().isEmpty().isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  check('monto', 'El monto es obligatorio y debe ser numérico').isFloat({ min: 0 }),
  check('metodo', 'El método de pago es obligatorio').isIn(['tarjeta', 'efectivo', 'transferencia']),
  validarCampos
], pagoControllers.createPago);

router.get('/estado/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos
], pagoControllers.getEstadoMembresia);

module.exports = router;
