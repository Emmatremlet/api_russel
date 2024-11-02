const mongoose = require('mongoose');
const schema = mongoose.Schema;

/**
 * Schéma pour le modèle Catway.
 *
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du ponton, requis.
 * @property {string} type - Type de ponton, soit 'long' soit 'short', requis.
 * @property {string} [catwayState='Indéterminé'] - État du ponton, par défaut 'Indéterminé'.
 * @property {Date} createdAt - Date de création du document, générée automatiquement.
 * @property {Date} updatedAt - Date de mise à jour du document, générée automatiquement.
 */
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