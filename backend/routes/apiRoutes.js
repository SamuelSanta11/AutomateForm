const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiRoutesController');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba exitosa' });
});

// Ruta login
router.post('/login', controller.login);
//Rutas maquina
router.get('/maquinas', controller.getMaquinas); 
router.post('/maquinas', controller.createMaquina);
router.delete('/maquinas/:id', controller.deleteMaquina);



// router.post('/reportes', controller.crearReporte);
// router.post('/maquinas', controller.crearMaquina);

module.exports = router;
