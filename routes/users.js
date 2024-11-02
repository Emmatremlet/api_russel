const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const userService = require('../services/users');
const private = require('../middlewares/private');

router.get('/', private.checkJWT, userService.getAll);
router.get('/:id/account', private.checkJWT, userService.getById);
router.post('/add', userController.add);
router.post('/:id/update', private.checkJWT, userController.update);
router.post('/:id/delete', private.checkJWT, userController.delete);
router.post('/authenticate', userController.authenticate);

module.exports = router;