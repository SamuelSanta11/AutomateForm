const pool = require('../config/database');
const path = require('path');

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

// Obtener todas las máquinas para administrador
const getMaquinas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener máquinas:', error);
    res.status(500).json({ error: 'Error al obtener las máquinas' });
  }
};

//Evento para crear nueva máquina
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

//Evento para eliminar máquina
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

// Evento para enviar un reporte
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

    //Validar todos los campos
    if (!usuario_id || !maquina_id || !fecha_incidente || !hora_incidente) {
      return res.status(400).json({ message: 'Datos incompletos.' });
    }

    const result = await pool.query(
      `INSERT INTO formularios_incidente (
        usuario_id, maquina_id, nombre_maquina, fecha_incidente,
        hora_incidente, causas, nivel_peligro, descripcion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        usuario_id,
        maquina_id,
        nombre_maquina || 'Desconocida',
        fecha_incidente,
        hora_incidente,
        causas,
        nivel_peligro,
        descripcion
      ]
    );

    const formulario_id = result.rows[0].id;

    //Guardar imagene en tabla evidencias
    if (req.file) {
      const imagenPath = path.join('uploads', req.file.filename);
      await pool.query(
        `INSERT INTO evidencias (formulario_id, imagen_path)
         VALUES ($1, $2)`,
        [formulario_id, imagenPath]
      );
    }

    //Obtener notificaciones para cada admin
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

    res.status(201).json({ success: true, message: 'Reporte enviado con éxito.' });

  } catch (error) {
    console.error('Error al enviar reporte:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el reporte.' });
  }
};

//Evento para obtener notificaciones
const getNotificaciones = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.id AS id, n.mensaje, n.creada_en
      FROM notificaciones n
      ORDER BY n.creada_en DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
};

//Evento para ver informacion del reporte
const getDetalleReporte = async (req, res) => {
  const notificacionId = req.params.id;

  try {
    const query = `
      SELECT f.id, f.usuario_id, f.maquina_id, m.nombre AS nombre_maquina,
             f.fecha_incidente, f.hora_incidente, f.causas,
             f.nivel_peligro, f.descripcion, e.imagen_path
      FROM notificaciones n
      JOIN formularios_incidente f ON n.formulario_id = f.id
      LEFT JOIN evidencias e ON e.formulario_id = f.id
      JOIN maquinas m ON m.id = f.maquina_id
      WHERE n.id = $1
    `;

    const { rows } = await pool.query(query, [notificacionId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró el informacion del reporte.' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Error al obtener detalle del reporte:', error);
    res.status(500).json({ message: 'Error del servidor al obtener la informacion del reporte.' });
  }
};


module.exports = {
  login,
  getMaquinas,
  createMaquina,
  deleteMaquina,
  enviarReporte,
  getNotificaciones,
  getDetalleReporte
};

