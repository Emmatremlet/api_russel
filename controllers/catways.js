const catwayService = require('../services/catways');


/**
 * Ajoute un nouveau catway.
 *
 * @async
 * @function add
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Contient les données de la requête.
 * @param {string} req.body.catwayNumber - Numéro du catway.
 * @param {string} req.body.type - Type de catway.
 * @param {string} [req.body.catwayState="Indéterminé"] - État du catway.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.add = async (req, res) => {
    const catwayData = {
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState || 'Indéterminé'
    };
    try {
        await catwayService.add(catwayData);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Met à jour un catway existant.
 *
 * @async
 * @function update
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Contient les données de la requête.
 * @param {string} req.body.catwayNumber - Numéro du catway.
 * @param {string} req.body.type - Type de catway.
 * @param {string} [req.body.catwayState="Indéterminé"] - État du catway.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.update = async (req, res) => {
    const catwayData = {
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState || 'Indéterminé'
    };
    try {
        await catwayService.update(req.params.id, catwayData);
        res.redirect('/catways/' + req.params.id + '/details');
    } catch (error) {
        console.error(error.message);
        res.status(404).json({ error: error.message });
    }
};

/**
 * Supprime un catway.
 *
 * @async
 * @function delete
 * @param {Object} req - Objet de requête Express.
 * @param {string} req.params.id - Identifiant du catway à supprimer.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await catwayService.delete(id);
        res.redirect('/catways/list');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};