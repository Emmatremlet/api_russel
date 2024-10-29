const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Catway = new schema({
    catwayNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: [true, 'Le numéro de pont est requis']
    },
    type: {
        type: String,
        trim: true,
        required: [true, 'Le type est requis'],
        enum: ['long', 'short']
    },
    catwayState: {
        type: String,
        trim: true,
        default: 'Indéterminé'
    },
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Catway', Catway);