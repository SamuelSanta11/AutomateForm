const pool = require('../config/database');

exports.createIncident = async (req, res) => {
  const { usuario_id, maquina_id, nombre_maquina, fecha_incidente, hora_incidente, causas, nivel_peligro, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO formularios_incidente (usuario_id, maquina_id, nombre_maquina, fecha_incidente, hora_incidente, causas, nivel_peligro, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [usuario_id, maquina_id, nombre_maquina, fecha_incidente, hora_incidente, causas, nivel_peligro, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating incident' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formularios_incidente');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching incidents' });
  }
};