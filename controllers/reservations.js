const reservationService = require('../services/reservations');

/**
 * Ajoute une nouvelle réservation.
 *
 * @async
 * @function add
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Contient les données de la réservation.
 * @param {string} req.body.catwayNumber - Numéro du catway réservé.
 * @param {string} req.body.clientName - Nom du client.
 * @param {string} req.body.boatName - Nom du bateau.
 * @param {Date} req.body.checkIn - Date de début de la réservation.
 * @param {Date} req.body.checkOut - Date de fin de la réservation.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.add = async (req, res) => {
    const reservationData = {
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut
    };
    try {
        await reservationService.add(reservationData);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error.message);
        return res.status(501).json({ error: error.message });
    }
};

/**
 * Met à jour une réservation existante.
 *
 * @async
 * @function update
 * @param {Object} req - Objet de requête Express.
 * @param {string} req.params.id - Identifiant de la réservation à mettre à jour.
 * @param {Object} req.body - Contient les données mises à jour de la réservation.
 * @param {string} req.body.catwayNumber - Numéro du catway réservé.
 * @param {string} req.body.clientName - Nom du client.
 * @param {string} req.body.boatName - Nom du bateau.
 * @param {Date} [req.body.checkIn=Date.now] - Date de début de la réservation (par défaut, la date actuelle si non fournie).
 * @param {Date} req.body.checkOut - Date de fin de la réservation.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.update = async (req, res) => {
    const id = req.params.id;
    const reservationData = {
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        checkIn: req.body.checkIn || Date.now,
        checkOut: req.body.checkOut
    };
    try {
        await reservationService.update(id, reservationData);
        res.redirect('/reservations/' + id + '/details');
    } catch (error) {
        console.log(error.message);
        res.status(501).json({ error: error.message });
    }
};


/**
 * Supprime une réservation.
 *
 * @async
 * @function delete
 * @param {Object} req - Objet de requête Express.
 * @param {string} req.params.id - Identifiant de la réservation à supprimer.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await reservationService.delete(id);
        res.redirect('/reservations/list');
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
};