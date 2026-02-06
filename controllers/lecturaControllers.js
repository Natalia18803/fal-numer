const Lectura = require('../models/lectura');
const Usuario = require('../models/usuario');

// Función simulada para generar contenido de IA
const generarContenidoIA = (tipo, fecha_nacimiento) => {
  if (tipo === 'principal') {
    const dia = fecha_nacimiento.getDate();
    const mes = fecha_nacimiento.getMonth() + 1;
    const numero = dia + mes;
    return `Tu número de vida es ${numero}. Este número representa tu camino espiritual y tus lecciones de vida.`;
  } else {
    const hoy = new Date().toLocaleDateString();
    return `Lectura diaria para ${hoy}: Hoy es un día propicio para nuevas oportunidades. Mantén una actitud positiva.`;
  }
};

exports.generarLecturaPrincipal = async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;

    // Verificar si ya existe una lectura principal
    const lecturaExistente = await Lectura.findOne({ usuario_id, tipo: 'principal' });
    if (lecturaExistente) {
      return res.status(400).json({ error: 'Ya existe una lectura principal para este usuario' });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const contenido = generarContenidoIA('principal', usuario.fecha_nacimiento);

    const lectura = new Lectura({
      usuario_id,
      tipo: 'principal',
      contenido
    });

    await lectura.save();
    res.status(201).json({ message: 'Lectura principal generada', lectura });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generarLecturaDiaria = async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario está activo
    if (usuario.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario no tiene membresía activa' });
    }

    // Verificar si ya existe una lectura diaria para hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const lecturaExistente = await Lectura.findOne({
      usuario_id,
      tipo: 'diaria',
      fecha_lectura: { $gte: hoy, $lt: manana }
    });

    if (lecturaExistente) {
      return res.status(400).json({ error: 'Ya existe una lectura diaria para hoy' });
    }

    const contenido = generarContenidoIA('diaria', usuario.fecha_nacimiento);

    const lectura = new Lectura({
      usuario_id,
      tipo: 'diaria',
      contenido
    });

    await lectura.save();
    res.status(201).json({ message: 'Lectura diaria generada', lectura });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLecturasByUsuario = async (req, res) => {
  try {
    const lecturas = await Lectura.find({ usuario_id: req.params.usuario_id }).sort({ fecha_lectura: -1 });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLecturaById = async (req, res) => {
  try {
    const lectura = await Lectura.findById(req.params.id).populate('usuario_id', 'nombre email');
    if (!lectura) {
      return res.status(404).json({ error: 'Lectura no encontrada' });
    }
    res.json(lectura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
