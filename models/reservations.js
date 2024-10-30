const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Reservation = new schema({
    catwayNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: [true, 'Le numéro de pont est requis']
    },
    clientName: {
        type: String,
        trim: true,
        unique : true,
        required: [true, 'Le type est requis'],
    },
    boatName: {
        type: String,
        trim: true,
        default: 'Indéterminé'
    },
    checkIn: {
        type: Date,
        trim : true,
        default: Date.now
    }, 
    checkOut: {
        type: Date,
        trim: true,
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Reservation', Reservation);