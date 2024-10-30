const Reservation = require('../models/reservations');

exports.getAll = async () => {
    try {
        const reservation = await Reservation.find();
        return reservation;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
};


exports.getById = async (id) => {
    try {
        let reservation = await Reservation.findById(id)
            .populate('catwayNumber')
            .populate('name');
        if (reservation) {
            return reservation;
        } else {
            throw new Error('reservation_not_found');
        }
    } catch (error) {
        throw error;
    }
};

exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.name,
        boatName :req.body.boatName,
        checkIn: req.body.checkIn || Date.now,
        checkOut: req.body.checkOut
    })
    try {
        let reservation = await Reservation.create(temp);
        res.redirect('/dashboard');
    } catch (error) {
        console.log('Erreur lors de la soumission du questionnaire :' + error);
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const id = req.params.id;
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName :req.body.boatName,
        checkIn: req.body.checkIn || Date.now,
        checkOut: req.body.checkOut
    })
    try {
        let reservation = await Reservation.findOne({ _id: id });
        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    reservation[key] = temp[key];
                }
            });
            await reservation.save()
            return res.redirect('/dashboard');
        }
        return res.status(404).json('reservation_not_found');
    } catch (error) {
        console.error(error);
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Reservation.deleteOne({ _id: id });
        res.redirect('/dashboard');
    } catch (error) {
        return res.status(501).json(error);
    }
}