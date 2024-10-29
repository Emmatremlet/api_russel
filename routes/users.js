var express = require('express');
var router = express.Router();
var service = require('../services/users');
const private = require('../middlewares/private');

router.get('/:id/account', private.checkJWT, service.getById);
router.post('/add', service.add);
router.post('/:id/update', private.checkJWT, service.update);
router.delete('/:id/delete', private.checkJWT, service.delete);
router.post('/authenticate', service.authenticate);

module.exports = router;
