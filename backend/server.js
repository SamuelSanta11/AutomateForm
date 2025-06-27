const express = require('express');
const path = require('path');
const pool = require('./config/database.js');
require('dotenv').config(); // Cargar variables de entorno
const routes = require('./routes/apiRoutes.js'); // Importar rutas

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Archivos estaticos desde el front end index.html
app.use(express.static(path.join(__dirname, '..')));


app.use('/api', routes); 


app.get('/', (req, res) => {
  res.send('Servidor ejecutándose correctamente');
});

// Conexion a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
  release();
});

// Iniciar el servidor Ctrl J, node server.js
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;