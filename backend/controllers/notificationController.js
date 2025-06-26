const pool = require('../config/database');

exports.createNotification = async (req, res) => {
  const { usuario_id, mensaje, formulario_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notificaciones (usuario_id, mensaje, formulario_id) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, mensaje, formulario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notificaciones WHERE leida = false');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};