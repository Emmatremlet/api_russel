const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catways');
const catwayService = require('../services/catways');

router.get('/', catwayService.getAll);
router.get('/:id', catwayService.getById);
router.get('/number', catwayService.findByCatwayNumber);
router.post('/add', catwayController.add);
router.post('/:id/update', catwayController.update);
router.post('/:id/delete', catwayController.delete);

module.exports = router;