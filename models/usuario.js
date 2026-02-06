const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'inactivo'
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
