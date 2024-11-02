const Catway = require('../models/catways');

exports.getAll = async () => {
    try {
        const catways = await Catway.find();
        return catways;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
};

exports.getById = async (id) => {
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

exports.findByCatwayNumber = async (catwayNumberUpdate) => {
    const catwayNumber = catwayNumberUpdate;
    const catway = await Catway.findOne({ catwayNumber });
    return catway;
};

exports.add = async (catwayData) => {
    try {
        const catway = await Catway.create(catwayData);
        return catway;
    } catch (error) {
        console.error("Error in Catway creation:", error);
        throw new Error('Erreur lors de la création du catway');
    }
};

exports.update = async (id, catwayData) => {
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

exports.delete = async (id) => {
    try {
        await Catway.deleteOne({ _id: id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression du catway');
    }
};