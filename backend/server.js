const express = require('express');
const path = require('path');
require('dotenv').config();

const pool = require('./config/database');
const routes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Capturar frontend HTML CSS JS
app.use(express.static(path.join(__dirname, '../frontend')));

// Capturar imágenes o archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta principal para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

