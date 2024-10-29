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
        let catway = await Catway.findById(id);
        if (catway) {
            return catway;
        } else {
            throw new Error('catway_not_found');
        }
    } catch (error) {
        throw error;
    }
};

exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState || 'Indéterminé'
    })
    try {
        let catway = await Catway.create(temp);
        res.redirect('/');
    } catch (error) {
        console.log('Erreur lors de la soumission du questionnaire :' + error);
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const id = req.params.id;
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        type: req.body.type,
        catwayState: req.body.catwayState || 'Indéterminé'
    })
    try {
        let catway = await Catway.findOne({ _id: id });
        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    catway[key] = temp[key];
                }
            });
            await catway.save()
            return res.redirect('/');
        }
        return res.status(404).json('catway_not_found');
    } catch (error) {
        console.error(error);
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Catway.deleteOne({ _id: id });
        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return res.status(501).json(error);
    }
}