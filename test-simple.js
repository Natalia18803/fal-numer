const express = require('express');
const app = express();

app.use(express.json());

// Ruta de prueba ultra simple
app.post('/test', (req, res) => {
    console.log('Body recibido:', req.body);
    res.json({ message: 'Test exitoso', body: req.body });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
});
