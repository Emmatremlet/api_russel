const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservations');
const reservationService = require('../services/reservations');

router.get('/', reservationService.getAll);
router.get('/:id', reservationService.getById);
router.get('/client', reservationService.findByClientName);
router.post('/add', reservationController.add);
router.post('/:id/update', reservationController.update);
router.post('/:id/delete', reservationController.delete);

module.exports = router;