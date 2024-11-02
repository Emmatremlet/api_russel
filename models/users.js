const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * Schéma pour le modèle User.
 *
 * @typedef {Object} User
 * @property {string} name - Nom de l'utilisateur, requis.
 * @property {string} email - Adresse email unique de l'utilisateur, en minuscules et requise.
 * @property {string} password - Mot de passe de l'utilisateur, haché avant la sauvegarde.
 * @property {Date} createdAt - Date de création du document, générée automatiquement.
 * @property {Date} updatedAt - Date de mise à jour du document, générée automatiquement.
 */
const User = new schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Le nom est requis']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
    },
    },
    {
        timestamps: true
    });

User.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('User', User);