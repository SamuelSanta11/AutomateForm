const express = require('express');
const router = express.Router();
const pool = require('../config/database');

//Mensaje de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba exitosa' });
});

//Ruta login
router.post('/login', async (req, res) => {
  console.log('Solicitud enviada al cuerpo:', req.body)
  const { username, password } = req.body;

  //Verificar que el usuario y la contraseña existan
  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña invalida' });
    }

    //Consulta el usuario en la base de datos
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    console.log('Usuario encontrado:', user);

    //Si el usuario existe pero la contraseña es incorrecta
    if (password !== user.password_hash) {
      return res.status(401).json({error: 'Contraseña incorrecta'});
    }
    //Credencial valida y existentes
    res.json({message: 'Inicio de sesion exitoso', user: {id: user.id, username: user.username, rol: user.rol}});
  } catch (error) {
    console.error('Error al iniciar sesion', error.stack);
    res.status(500).json({error: 'error interno del servidor', details: error.message});
  }
})
// Exporta la ruta
module.exports = router;