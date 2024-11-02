
const Reservation = require('../models/reservations');

exports.getAll = async () => {
    try {
        const reservation = await Reservation.find()
        return reservation;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données des réservations');
    }
};


exports.getById = async (id) => {
    try {
        let reservation = await Reservation.findById(id)
        if (reservation) {
            return reservation;
        } else {
            throw new Error('reservation_not_found');
        }
    } catch (error) {
        throw error;
    }
};

exports.findByClientName = async (clientName) => {
    const reservation = await Reservation.findOne({ clientName });
    return reservation;
};


exports.add = async (reservationData) => {
    try {
        let reservation = await Reservation.create(reservationData);
        return reservation
    } catch (error) {
        console.log('Erreur lors de la soumission du questionnaire de réservations :' + error);
        return res.status(501).json(error);
    }
}

exports.update = async (id, reservationData) => {
    try {
        const reservation = await Reservation.findOne({ _id: id });
        if (reservation) {
            Object.keys(reservationData).forEach((key) => {
                if (reservationData[key] !== undefined) {
                    reservation[key] = reservationData[key];
                }
            });
            await reservation.save();
            return reservation;
        }
        throw new Error('reservation_not_found');
    } catch (error) {
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        await Reservation.deleteOne({ _id: id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression de la réservation');
    }
};