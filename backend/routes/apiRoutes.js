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
router.get('/maquinas', controller.obtenerMaquinas);
router.get('/notificaciones/:usuario_id', controller.getNotificaciones);

//Ruta para enviar reporte
router.post('/enviar-reporte', controller.enviarReporte); 


module.exports = router;
