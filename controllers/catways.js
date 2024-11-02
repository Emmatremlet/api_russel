const catwayService = require('../services/catways');

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

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await catwayService.delete(id);
        res.redirect('/catways/list');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};