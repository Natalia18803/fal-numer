const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    fecha_pago: {
        type: Date,
        default: Date.now
    },
    fecha_vencimiento: {
        type: Date,
        required: true
    },
    metodo: {
        type: String,
        enum: ['tarjeta', 'efectivo', 'transferencia'],
        required: true
    }
});

module.exports = mongoose.model('Pago', pagoSchema);
