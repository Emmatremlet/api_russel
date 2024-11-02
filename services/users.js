const User = require('../models/users');
const bcrypt = require('bcrypt');


/**
 * Récupère tous les utilisateurs.
 * @returns {Promise<Array>} - Une promesse qui résout un tableau d'utilisateurs.
 * @throws {Error} - Erreur lors de la récupération des données.
 */
exports.getAll = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
};

/**
 * Récupère un utilisateur par son ID.
 * @param {string} id - L'ID de l'utilisateur à récupérer.
 * @returns {Promise<Object>} - Une promesse qui résout l'utilisateur trouvé.
 * @throws {Error} - 'Utilisateur non trouvé' si l'utilisateur n'existe pas.
 */
exports.getById = async (id) => {
    try {
        const user = await User.findById(id).lean();
        if (!user) throw new Error('Utilisateur non trouvé');
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Ajoute un nouvel utilisateur.
 * @param {Object} userData - Les données de l'utilisateur à créer.
 * @returns {Promise<Object>} - Une promesse qui résout l'utilisateur créé.
 * @throws {Error} - 'Tous les champs sont requis' si des champs sont manquants,
 *                   ou 'L'email est déjà utilisé' si l'email est en double.
 */
exports.add = async (userData) => {
    try {
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error("Tous les champs sont requis.");
        }

        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await User.create(userData);
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("L'email est déjà utilisé.");
        }
        throw error;
    }
};


/**
 * Met à jour un utilisateur existant.
 * @param {string} id - L'ID de l'utilisateur à mettre à jour.
 * @param {Object} userData - Les données mises à jour de l'utilisateur.
 * @returns {Promise<Object>} - Une promesse qui résout l'utilisateur mis à jour.
 * @throws {Error} - 'user_not_found' si l'utilisateur n'existe pas.
 */
exports.update = async (id, userData) => {
    try {
        const user = await User.findOne({ _id: id });
        if (!user) throw new Error('user_not_found');

        if (userData.name) user.name = userData.name;
        if (userData.email) user.email = userData.email;

        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Supprime un utilisateur par son ID.
 * @param {string} id - L'ID de l'utilisateur à supprimer.
 * @returns {Promise<void>} - Une promesse qui résout lorsque l'utilisateur est supprimé.
 * @throws {Error} - Erreur lors de la suppression de l'utilisateur.
 */
exports.delete = async (id) => {
    try {
        await User.deleteOne({ _id: id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
};

/**
 * Authentifie un utilisateur en vérifiant ses identifiants.
 * @param {Object} temp - Les données d'authentification contenant l'email et le mot de passe.
 * @returns {Promise<Object>} - Une promesse qui résout l'utilisateur authentifié.
 * @throws {Error} - 'user_not_found' si l'utilisateur n'existe pas ou 'wrong_credentials' si les identifiants sont incorrects.
 */
exports.authenticate = async (temp) => {
    try {
        const user = await User.findOne({ email: temp.email }, '-__v -createdAt -updatedAt');
        if (!user) throw new Error('user_not_found');

        const match = await bcrypt.compare(temp.password, user.password);
        if (!match) throw new Error('wrong_credentials');

        delete user._doc.password;
        return user;
    } catch (error) {
        throw error;
    }
};