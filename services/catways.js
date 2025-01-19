import Catway from '../models/catways.js';

/**
 * Récupère tous les catways.
 * @returns {Promise<Array>} - Une promesse qui résout un tableau de catways.
 * @throws {Error} - Erreur lors de la récupération des données.
 */
export const getAll = async () => {
    try {
        const catways = await Catway.find();
        return catways;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
};

/**
 * Récupère un catway par son ID.
 * @param {string} id - L'ID du catway à récupérer.
 * @returns {Promise<Catway>} - Une promesse qui résout le catway trouvé.
 * @throws {Error} - 'catway_not_found' si le catway n'existe pas ou autre erreur.
 */
export const getById = async (id) => {
    try {
        const catway = await Catway.findById(id);
        if (catway) {
            return catway;
        } else {
            throw new Error('catway_not_found');
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Trouve un catway par son numéro de pont.
 * @param {string} catwayNumberUpdate - Le numéro du catway à rechercher.
 * @returns {Promise<Catway|null>} - Une promesse qui résout le catway trouvé ou null si non trouvé.
 */
export const findByCatwayNumber = async (catwayNumberUpdate) => {
    const catwayNumber = catwayNumberUpdate;
    const catway = await Catway.findOne({ catwayNumber });
    return catway;
};

/**
 * Ajoute un nouveau catway.
 * @param {Object} catwayData - Les données du catway à créer.
 * @returns {Promise<Catway>} - Une promesse qui résout le catway créé.
 * @throws {Error} - Erreur lors de la création du catway.
 */
export const add = async (catwayData) => {
    try {
        const catway = await Catway.create(catwayData);
        return catway;
    } catch (error) {
        console.error("Error in Catway creation:", error);
        throw new Error('Erreur lors de la création du catway');
    }
};

/**
 * Met à jour un catway existant.
 * @param {string} id - L'ID du catway à mettre à jour.
 * @param {Object} catwayData - Les données mises à jour du catway.
 * @returns {Promise<Catway>} - Une promesse qui résout le catway mis à jour.
 * @throws {Error} - 'catway_not_found' si le catway n'existe pas ou autre erreur.
 */
export const update = async (id, catwayData) => {
    try {
        const catway = await Catway.findOne({ _id: id });
        if (catway) {
            Object.keys(catwayData).forEach((key) => {
                if (catwayData[key] !== undefined) {
                    catway[key] = catwayData[key];
                }
            });
            await catway.save();
            return catway;
        }
        throw new Error('catway_not_found');
    } catch (error) {
        throw error;
    }
};

/**
 * Supprime un catway ou tous les catways si aucun ID n'est fourni.
 * @param {string|null} id - L'ID du catway à supprimer ou null pour tout supprimer.
 * @returns {Promise<void>} - Une promesse qui résout lorsque la suppression est effectuée.
 * @throws {Error} - Erreur lors de la suppression du catway.
 */
export const deleteCatway = async (id = null) => {
    try {
        if (id) {
            await Catway.deleteOne({ _id: id });
        } else {
            await Catway.deleteMany({});
        }
    } catch (error) {
        throw new Error('Erreur lors de la suppression du catway');
    }
};