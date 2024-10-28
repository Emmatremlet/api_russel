var express = require('express');
var router = express.Router();
var service = require('../services/catways');

router.get('/', service.getAll);
router.get('/:id', service.getById);
router.post('/add', service.add);
router.patch('/:id', service.update);
router.delete('/:id', service.delete);

module.exports = router;
