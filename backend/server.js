const express = require('express');
const path = require('path');
require('dotenv').config();

const pool = require('./config/database');
const routes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api', routes);

//Prueba de conexion
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

  release(); // liberar cliente del pool
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
