const pool = require('../config/database');

// Controlador para el login
const login = async (req, res) => {
  console.log('Solicitud recibida con:', req.body);
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las máquinas (para administrador)
const getMaquinas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener máquinas:', error);
    res.status(500).json({ error: 'Error al obtener las máquinas' });
  }
};

// Crear nueva máquina
const createMaquina = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json({
      message: 'Máquina creada con éxito',
      maquina: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear la máquina:', error);
    res.status(500).json({ error: 'Error al crear la máquina' });
  }
};

// Eliminar máquina
const deleteMaquina = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM maquinas WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Máquina no encontrada' });
    }

    res.json({ message: 'Máquina eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la máquina:', error);
    res.status(500).json({ error: 'Error al eliminar la máquina' });
  }
};

// Controlador para enviar un reporte
const enviarReporte = async (req, res) => {
  try {
    const {
      usuario_id,
      maquina_id,
      nombre_maquina,
      fecha_incidente,
      hora_incidente,
      causas,
      nivel_peligro,
      descripcion
    } = req.body;

    const result = await pool.query(
      `INSERT INTO formularios_incidente (
        usuario_id, maquina_id, nombre_maquina, fecha_incidente,
        hora_incidente, causas, nivel_peligro, descripcion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id`,
      [usuario_id, maquina_id, nombre_maquina, fecha_incidente, hora_incidente, causas, nivel_peligro, descripcion]
    );

    const formulario_id = result.rows[0].id;

    // Buscar todos los usuarios con rol 'admin' para notificar
    const adminsResult = await pool.query(`SELECT id FROM usuarios WHERE rol = 'admin'`);
    const admins = adminsResult.rows;

    const mensaje = `Nuevo reporte de incidente en máquina ${nombre_maquina} - Nivel: ${nivel_peligro}`;

    for (const admin of admins) {
      await pool.query(
        `INSERT INTO notificaciones (usuario_id, mensaje, formulario_id)
         VALUES ($1, $2, $3)`,
        [admin.id, mensaje, formulario_id]
      );
    }

    res.status(201).json({ message: 'Reporte enviado y notificaciones creadas.' });

  } catch (error) {
    console.error('Error al enviar reporte:', error);
    res.status(500).json({ error: 'Error al enviar el reporte.' });
  }
};


const obtenerMaquinas = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, nombre FROM maquinas ORDER BY nombre ASC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener máquinas:', error);
    res.status(500).json({ error: 'Error al obtener máquinas.' });
  }
};

// Obtener notificaciones para un usuario
const getNotificaciones = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, mensaje, creada_en, leida
       FROM notificaciones
       WHERE usuario_id = $1
       ORDER BY creada_en DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
};


module.exports = {
  login,
  getMaquinas,
  createMaquina,
  deleteMaquina,
  enviarReporte,
  obtenerMaquinas,
  getNotificaciones
};

