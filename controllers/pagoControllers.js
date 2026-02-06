const Pago = require('../models/pago');
const Usuario = require('../models/usuario');

exports.getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.find()
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPagosByUsuario = async (req, res) => {
  try {
    const pagos = await Pago.find({ usuario_id: req.params.usuario_id }).sort({ fecha_pago: -1 });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPago = async (req, res) => {
  try {
    const { usuario_id, monto, metodo } = req.body;

    // Calcular fecha de vencimiento (30 días desde hoy)
    const fecha_vencimiento = new Date();
    fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 30);

    const pago = new Pago({
      usuario_id,
      monto,
      metodo,
      fecha_vencimiento
    });

    await pago.save();

    // Actualizar estado del usuario a activo
    await Usuario.findByIdAndUpdate(usuario_id, { estado: 'activo' });

    res.status(201).json({ message: 'Pago registrado y membresía activada', pago });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstadoMembresia = async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar el pago más reciente
    const ultimoPago = await Pago.findOne({ usuario_id }).sort({ fecha_pago: -1 });

    let estado = 'inactivo';
    let mensaje = 'Membresía vencida o no existe';

    if (ultimoPago) {
      const hoy = new Date();
      if (ultimoPago.fecha_vencimiento > hoy) {
        estado = 'activo';
        mensaje = `Membresía activa hasta ${ultimoPago.fecha_vencimiento.toLocaleDateString()}`;
      } else {
        // Si está vencido, actualizar estado en BD
        await Usuario.findByIdAndUpdate(usuario_id, { estado: 'inactivo' });
        mensaje = 'Membresía vencida';
      }
    }

    res.json({
      usuario_id,
      estado,
      mensaje,
      ultimo_pago: ultimoPago
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
