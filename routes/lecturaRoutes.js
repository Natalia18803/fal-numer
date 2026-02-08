const express = require('express');
const router = express.Router();
const lecturaControllers = require('../controllers/lecturaControllers');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId } = require('../helpers/usuario');

// GET todas las lecturas
router.get('/', lecturaControllers.getAllLecturas);

// Rutas con segmentos estáticos (deben ir ANTES de /:id)
router.get('/usuario/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos
], lecturaControllers.getLecturasByUsuario);

router.post('/principal/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos
], lecturaControllers.generarLecturaPrincipal);

router.post('/diaria/:usuario_id', [
  check('usuario_id', 'No es un ID válido').isMongoId(),
  check('usuario_id').custom(existeUsuarioPorId),
  validarCampos
], lecturaControllers.generarLecturaDiaria);

// Ruta genérica con parámetro (debe ir AL FINAL)
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], lecturaControllers.getLecturaById);

module.exports = router;
