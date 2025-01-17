import Reservation from '../models/reservations.js';

/**
 * Récupère toutes les réservations.
 * @returns {Promise<Array>} - Une promesse qui résout un tableau de réservations.
 * @throws {Error} - Erreur lors de la récupération des données des réservations.
 */
export const getAll = async () => {
    try {
        const reservation = await Reservation.find();
        return reservation;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données des réservations');
    }
};

/**
 * Récupère une réservation par son ID.
 * @param {string} id - L'ID de la réservation à récupérer.
 * @returns {Promise<Reservation>} - Une promesse qui résout la réservation trouvée.
 * @throws {Error} - 'reservation_not_found' si la réservation n'existe pas ou autre erreur.
 */
export const getById = async (id) => {
    try {
        const reservation = await Reservation.findById(id);
        if (reservation) {
            return reservation;
        } else {
            throw new Error('reservation_not_found');
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Trouve une réservation par le nom du client.
 * @param {string} clientName - Le nom du client à rechercher.
 * @returns {Promise<Reservation|null>} - Une promesse qui résout la réservation trouvée ou null si non trouvée.
 */
export const findByClientName = async (clientName) => {
    const reservation = await Reservation.findOne({ clientName });
    return reservation;
};

/**
 * Ajoute une nouvelle réservation.
 * @param {Object} reservationData - Les données de la réservation à créer.
 * @returns {Promise<Reservation>} - Une promesse qui résout la réservation créée.
 * @throws {Error} - Erreur lors de la soumission de la réservation.
 */
export const add = async (reservationData) => {
    try {
        const reservation = await Reservation.create(reservationData);
        return reservation;
    } catch (error) {
        console.error('Erreur lors de la soumission du questionnaire de réservations :', error);
        throw new Error('Erreur lors de la soumission de la réservation');
    }
};

/**
 * Met à jour une réservation existante.
 * @param {string} id - L'ID de la réservation à mettre à jour.
 * @param {Object} reservationData - Les données mises à jour de la réservation.
 * @returns {Promise<Reservation>} - Une promesse qui résout la réservation mise à jour.
 * @throws {Error} - 'reservation_not_found' si la réservation n'existe pas ou autre erreur.
 */
export const update = async (id, reservationData) => {
    try {
        const reservation = await Reservation.findOne({ _id: id });
        if (reservation) {
            Object.keys(reservationData).forEach((key) => {
                if (reservationData[key] !== undefined) {
                    reservation[key] = reservationData[key];
                }
            });
            await reservation.save();
            return reservation;
        }
        throw new Error('reservation_not_found');
    } catch (error) {
        throw error;
    }
};

/**
 * Supprime une réservation par son ID.
 * @param {string} id - L'ID de la réservation à supprimer.
 * @returns {Promise<void>} - Une promesse qui résout lorsque la réservation est supprimée.
 * @throws {Error} - Erreur lors de la suppression de la réservation.
 */
export const deleteReservation = async (id) => {
    try {
        await Reservation.deleteOne({ _id: id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression de la réservation');
    }
};