const mongoose = require('mongoose');

const ClientOptions = {
    dbName: 'Cluster0'
};

/**
 * Initialise la connexion à la base de données MongoDB.
 *
 * @async
 * @function initClientDbConnection
 * @returns {Promise<void>} - Résout une promesse une fois la connexion établie.
 * @throws {Error} - Lance une erreur si la connexion échoue.
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, ClientOptions)
        console.log('Connecté');
    } catch (error) {
        console.log(error);
        throw error;
    }
}