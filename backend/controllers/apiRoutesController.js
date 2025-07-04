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

// Obtener todas las máquinas
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


module.exports = {
  login,
  getMaquinas,
  createMaquina,
  deleteMaquina
};
