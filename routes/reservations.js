var express = require('express');
var router = express.Router();
var service = require('../services/reservations');

router.get('/', service.getAll);
router.get('/:id', service.getById);
router.post('/add', service.add);
router.post('/:id/update', service.update);
router.post('/:id/delete', service.delete);

module.exports = router;
