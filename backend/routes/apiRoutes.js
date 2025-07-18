const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiRoutesController');
const upload = require('../middlewares/upload');

//Ruta prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba exitosa' });
});

//Ruta login
router.post('/login', controller.login); //Login

//Rutas maquinas
router.get('/maquinas', controller.getMaquinas); //Obtener
router.post('/maquinas', controller.createMaquina); //Crear
router.delete('/maquinas/:id', controller.deleteMaquina); //Eliminar

//Ruta enviar reporte
router.post('/enviar-reporte', upload.single('imagen'), controller.enviarReporte); //Enviar

//Ruta obtener notificaciones
router.get('/notificaciones/:id', controller.getNotificaciones); //Obtener

//Ruta informacion de la notificacion
router.get('/detalle-reporte/:id', controller.getDetalleReporte);//Obtener
router.get('/contador-notificaciones/:id', controller.getContadorNotificaciones);//Obtener
router.put('/marcar-leida/:id', controller.marcarNotificacionLeida);//Actualizar





module.exports = router;
