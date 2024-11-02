const userService = require('../services/users');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Ajoute un nouvel utilisateur.
 *
 * @async
 * @function add
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Contient les données de l'utilisateur.
 * @param {string} req.body.name - Nom de l'utilisateur.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe de l'utilisateur.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.add = async (req, res, next) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        await userService.add(userData);
        res.redirect('/users/signin');
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Met à jour les informations d'un utilisateur.
 *
 * @async
 * @function update
 * @param {Object} req - Objet de requête Express.
 * @param {string} req.params.id - Identifiant de l'utilisateur à mettre à jour.
 * @param {Object} req.body - Contient les nouvelles informations de l'utilisateur.
 * @param {string} req.body.name - Nouveau nom de l'utilisateur.
 * @param {string} req.body.email - Nouvel email de l'utilisateur.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.update = async (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email
    };

    try {
        await userService.update(req.params.id, userData);
        res.redirect('/users/' + req.params.id + '/account');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


/**
 * Supprime un utilisateur.
 *
 * @async
 * @function delete
 * @param {Object} req - Objet de requête Express.
 * @param {string} req.params.id - Identifiant de l'utilisateur à supprimer.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.delete = async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Authentifie un utilisateur et génère un token JWT.
 *
 * @async
 * @function authenticate
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.body - Contient les informations d'authentification.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe de l'utilisateur.
 * @param {Object} res - Objet de réponse Express.
 * @returns {void}
 */
exports.authenticate = async (req, res) => {
    const temp = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const user = await userService.authenticate(temp);
        const expireIn = 24 * 60 * 60;
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: expireIn });
        res.cookie('token', 'Bearer ' + token, { httpOnly: true, maxAge: expireIn * 1000 });
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};