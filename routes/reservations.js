import express from 'express';
import * as reservationController from '../controllers/reservations.js';
import * as reservationService from '../services/reservations.js';
import * as authMiddleware from '../middlewares/private.js';

export const router = express.Router();


/**
 * @route GET /reservations
 * @group Reservations - Operations about reservations
 * @returns {Array.<Reservation>} 200 - An array of reservations
 * @returns {Error} 500 - Internal server error
 */
router.get('/', authMiddleware.checkJWT, reservationService.getAll);

/**
 * @route GET /reservations/:id
 * @group Reservations - Operations about reservations
 * @param {string} id.path.required - Reservation ID
 * @returns {Reservation} 200 - A reservation object
 * @returns {Error} 404 - Reservation not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/:id',authMiddleware.checkJWT, reservationService.getById);


/**
 * @route GET /reservations/client
 * @group Reservations - Operations about reservations
 * @param {string} clientName.query.required - Name of the client
 * @returns {Array.<Reservation>} 200 - An array of reservations for the specified client
 * @returns {Error} 500 - Internal server error
 */
router.get('/client',authMiddleware.checkJWT, reservationService.findByClientName);

/**
 * @route POST /reservations/add
 * @group Reservations - Operations about reservations
 * @param {Reservation.model} reservation.body.required - Reservation object to be added
 * @returns {Object} 201 - Successfully created reservation
 * @returns {Error} 500 - Internal server error
 */
router.post('/add',authMiddleware.checkJWT, reservationController.add);

/**
 * @route POST /reservations/:id/update
 * @group Reservations - Operations about reservations
 * @param {string} id.path.required - Reservation ID
 * @param {Reservation.model} reservation.body.required - Updated reservation object
 * @returns {Object} 200 - Successfully updated reservation
 * @returns {Error} 404 - Reservation not found
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/update',authMiddleware.checkJWT, reservationController.update);

/**
 * @route POST /reservations/:id/delete
 * @group Reservations - Operations about reservations
 * @param {string} id.path.required - Reservation ID
 * @returns {Object} 204 - Successfully deleted reservation
 * @returns {Error} 404 - Reservation not found
 * @returns {Error} 500 - Internal server error
 */
router.post('/:id/delete',authMiddleware.checkJWT, reservationController.delet);

export default router;