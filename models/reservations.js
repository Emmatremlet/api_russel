import mongoose from 'mongoose';
const schema = mongoose.Schema;

/**
 * Schéma pour le modèle Reservation.
 *
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro unique du ponton, requis.
 * @property {string} clientName - Nom unique du client, requis.
 * @property {string} [boatName='Indéterminé'] - Nom du bateau, par défaut 'Indéterminé'.
 * @property {Date} [checkIn=Date.now] - Date de début de la réservation, par défaut la date actuelle.
 * @property {Date} checkOut - Date de fin de la réservation.
 * @property {Date} createdAt - Date de création du document, générée automatiquement.
 * @property {Date} updatedAt - Date de mise à jour du document, générée automatiquement.
 */
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


export default mongoose.model('Reservation', Reservation);