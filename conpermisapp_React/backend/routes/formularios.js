const express = require('express');
const router = express.Router();

// Ejemplo de endpoint GET para '/formularios'
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Listado de formularios (GET)' });
});

// Ejemplo de endpoint POST para '/formularios'
router.post('/', (req, res) => {
  // Aquí iría la lógica para crear un formulario
  res.status(201).json({ message: 'Formulario creado (POST)' });
});

// Exporta directamente el router
module.exports = router;