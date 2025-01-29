const express = require('express');
const { sequelize } = require('../db');
const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: '✅ Conexión exitosa a la base de datos' });
  } catch (error) {
    console.error('❌ Error en la conexión a PostgreSQL:', error);
    res.status(500).json({ error: 'Error en la conexión a la base de datos' });
  }
});

module.exports = router;
