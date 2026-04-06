const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bandas ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo bandas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, provincia } = req.body;
    const result = await pool.query(
      `INSERT INTO bandas (nombre, descripcion, provincia)
       VALUES ($1,$2,$3) RETURNING *`,
      [nombre, descripcion, provincia]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creando banda' });
  }
});

module.exports = router;