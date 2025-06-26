const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');

router.post('/', machineController.createMachine);
router.get('/', machineController.getMachines);

module.exports = router;