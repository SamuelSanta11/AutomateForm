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

//Ruta para enviar reporte
router.post('/enviar-reporte', controller.enviarReporte);

//Ruta para obtener notificaciones
router.get('/notificaciones/:id', controller.getNotificaciones);



module.exports = router;
