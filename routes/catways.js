import express from 'express';
import * as catwayController from '../Controllers/catways.js';
import * as catwayService from '../services/catways.js';
import * as authMiddleware from '../middlewares/private.js';

export const router = express.Router();

/**
 * @route GET /
 * @group Catways - Operations about catways
 * @returns {Array.<Catway>} 200 - An array of catways
 * @returns {Error} 500 - Internal server error
 */
router.get('/', authMiddleware.checkJWT,catwayService.getAll);

/**
 * @route GET /:id
 * @group Catways - Operations about catways
 * @param {string} id.path.required - Catway ID
 * @returns {Catway} 200 - The requested catway
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/:id', authMiddleware.checkJWT,catwayService.getById);

/**
 * @route GET /number
 * @group Catways - Operations about catways
 * @returns {Catway} 200 - The catway found by its number
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/number',authMiddleware.checkJWT, catwayService.findByCatwayNumber);

/**
 * @route POST /add
 * @group Catways - Operations about catways
 * @param {Catway.model} catway.body.required - Catway object to add
 * @returns {Catway} 201 - The created catway
 * @returns {Error} 400 - Invalid input data
 * @returns {Error} 500 - Internal server error
 */
router.post('/add',authMiddleware.checkJWT, catwayController.add);

/**
 * @route POST /:id/update
 * @group Catways - Operations about catways
 * @param {string} id.path.required - Catway ID
 * @param {Catway.model} catway.body.required - Catway object with updated data
 * @returns {Catway} 200 - The updated catway
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 400 - Invalid input data
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/update',authMiddleware.checkJWT, catwayController.update);

/**
 * @route POST /:id/delete
 * @group Catways - Operations about catways
 * @param {string} id.path.required - Catway ID
 * @returns {null} 204 - Catway successfully deleted
 * @returns {Error} 404 - Catway not found
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/delete',authMiddleware.checkJWT, catwayController.delet);


export default router;