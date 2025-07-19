const express = require('express');
const path = require('path');
require('dotenv').config();

const pool = require('./config/database');
const routes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal redirige al login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

// Capturar frontend HTML CSS JS
app.use(express.static(path.join(__dirname, '../frontend')));

// Capturar imágenes o archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api', routes);

// Prueba de conexión
pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');

  try {
    await client.query("SET TIME ZONE 'America/Bogota'");
    console.log('Zona horaria establecida a America/Bogota');
  } catch (timezoneErr) {
    console.error('Error al configurar zona horaria:', timezoneErr);
  }

  release();
});

// Iniciar servidor Ctrl + J node server.js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://192.168.13.39:${PORT}`);
});
