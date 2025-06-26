const pool = require('../config/database');

exports.createMachine = async (req, res) => {
  const { nombre, descripcion, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, estado || 'operando']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating machine' });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching machines' });
  }
};