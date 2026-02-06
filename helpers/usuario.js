const Usuario = require('../models/usuario.js');

const existeUsuarioPorId = async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        throw new Error(`El usuario con ID ${id} no existe`);
    }
};

const validarEmail = async (email) => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

module.exports = {
    existeUsuarioPorId,
    validarEmail
};
