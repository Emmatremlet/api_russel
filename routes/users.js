import express from 'express';
import * as userController from '../controllers/users.js';
import * as userService from '../services/users.js';
import * as authMiddleware from '../middlewares/private.js';

export const router = express.Router();

/**
 * @route GET /users
 * @group Users - Operations about users
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error} 500 - Internal server error
 */
router.get('/', authMiddleware.checkJWT, userService.getAll);

/**
 * @route GET /users/:id/account
 * @group Users - Operations about users
 * @param {string} id.path.required - User ID
 * @returns {User} 200 - A user object
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/:id/account', authMiddleware.checkJWT, userService.getById);

/**
 * @route POST /users/add
 * @group Users - Operations about users
 * @param {User.model} user.body.required - User object to be added
 * @returns {Object} 201 - Successfully created user
 * @returns {Error} 500 - Internal server error
 */
router.post('/add', userController.add);

/**
 * @route POST /users/:id/update
 * @group Users - Operations about users
 * @param {string} id.path.required - User ID
 * @param {User.model} user.body.required - Updated user object
 * @returns {Object} 200 - Successfully updated user
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/update', authMiddleware.checkJWT, userController.update);

/**
 * @route POST /users/:id/delete
 * @group Users - Operations about users
 * @param {string} id.path.required - User ID
 * @returns {Object} 204 - Successfully deleted user
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/delete', authMiddleware.checkJWT, userController.delet);

/**
 * @route POST /users/authenticate
 * @group Users - Operations about users
 * @param {UserCredentials.model} user.body.required - User credentials for authentication
 * @returns {Object} 200 - Successfully authenticated user with token
 * @returns {Error} 401 - Authentication failed
 * @returns {Error} 500 - Internal server error
 */
router.post('/authenticate', userController.authenticate);

export default router;