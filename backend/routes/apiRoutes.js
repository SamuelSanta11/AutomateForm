const express = require('express');
const router = express.Router();
const pool = require('../config/database');

//Mensaje de prueba get y endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba exitosa' });
});

//Ruta login
router.post('/login', async (req, res) => {
  console.log('Solicitud recibida con:', req.body);
  const { username, password } = req.body;


  try {
    if (!username || !password) { // Verica que usuario y contraseña considan
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (result.rows.length === 0) { //Si el usuario no se encuentra
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    if (password !== user.password_hash) { //Si el usuario existe pero la contraseña es incorrecta
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ //sweft alert si el inicio de sesion es exitoso y username y password considen mutuamente
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
});

module.exports = router;