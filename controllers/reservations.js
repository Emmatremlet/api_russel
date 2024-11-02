const reservationService = require('../services/reservations');

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

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await reservationService.delete(id);
        res.redirect('/reservations/list');
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
};