const express = require('express');
const router = express.Router();
const lecturaControllers = require('../controllers/lecturaControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId } = require('../helpers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validar-rol');
const { validarEstado } = require('../middlewares/validar-estado');

// Todas las rutas de lecturas requieren autenticación
router.use(validarJWT);

// ==========================================
//  RUTAS DE LECTURAS - SOLO ADMIN
// ==========================================

// GET todas las lecturas - Solo admin
router.get('/', validarRol('admin'), lecturaControllers.getAllLecturas);

// Ruta genérica con parámetro (debe ir AL FINAL) - Solo admin
router.get('/:id', 
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos,
  validarRol('admin'),
  lecturaControllers.getLecturaById
);

// ==========================================
//  RUTAS DE LECTURAS - USUARIO ACTIVO (con pago)
// ==========================================

// Rutas con segmentos estáticos (deben ir ANTES de /:id) - Requiere estado activo
router.get('/usuario/:usuario_id', 
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos,
  validarEstado,
  lecturaControllers.getLecturasByUsuario
);

router.post('/principal/:usuario_id', 
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos,
  validarEstado,
  lecturaControllers.generarLecturaPrincipal
);

router.post('/diaria/:usuario_id', 
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos,
  validarEstado,
  lecturaControllers.generarLecturaDiaria
);

module.exports = router;
