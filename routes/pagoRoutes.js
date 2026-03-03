const express = require('express');
const router = express.Router();
const pagoControllers = require('../controllers/pagoControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId } = require('../helpers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol');
const { validarEstado } = require('../middlewares/validar-estado');

// Todas las rutas de pagos requieren autenticación
router.use(validarJWT);

// ==========================================
//  RUTAS DE PAGOS - SOLO ADMIN
// ==========================================

// GET todos los pagos - Solo admin
router.get('/', validarRol('admin'), pagoControllers.getAllPagos);

// ==========================================
//  RUTAS DE PAGOS - CUALQUIER USUARIO AUTENTICADO
// ==========================================

// Crear pago - Cualquier usuario (inactivo o activo) puede crear un pago
// Esto es para que el usuario pueda pagar y convertirse en activo
router.post('/', [
  check('usuario_id', 'Usuario ID es obligatorio').not().isEmpty().isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  check('monto', 'El monto es obligatorio y debe ser numérico').isFloat({ min: 0 }),
  check('metodo', 'El método de pago es obligatorio').isIn(['tarjeta', 'efectivo', 'transferencia']),
  validarCampos
], pagoControllers.createPago);

// ==========================================
//  RUTAS DE PAGOS - USUARIO ACTIVO (con pago)
// ==========================================

// Rutas con segmentos estáticos (deben ir ANTES de /:usuario_id) - Requiere estado activo
router.get('/estado/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos,
  validarEstado
], pagoControllers.getEstadoMembresia);

// Ruta genérica con parámetro (debe ir AL FINAL) - Requiere estado activo
router.get('/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos,
  validarEstado
], pagoControllers.getPagosByUsuario);

module.exports = router;
