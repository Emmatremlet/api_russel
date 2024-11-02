const User = require('../models/users');
const bcrypt = require('bcrypt');

exports.getAll = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des données');
    }
};

exports.getById = async (id) => {
    try {
        const user = await User.findById(id).lean();
        if (!user) throw new Error('Utilisateur non trouvé');
        return user;
    } catch (error) {
        throw error;
    }
};

exports.add = async (userData) => {
    try {
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error("Tous les champs sont requis.");
        }

        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await User.create(userData);
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("L'email est déjà utilisé.");
        }
        throw error;
    }
};

exports.update = async (id, userData) => {
    try {
        const user = await User.findOne({ _id: id });
        if (!user) throw new Error('user_not_found');

        if (userData.name) user.name = userData.name;
        if (userData.email) user.email = userData.email;

        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        await User.deleteOne({ _id: id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
};


exports.authenticate = async (temp) => {
    try {
        const user = await User.findOne({ email: temp.email }, '-__v -createdAt -updatedAt');
        if (!user) throw new Error('user_not_found');

        const match = await bcrypt.compare(temp.password, user.password);
        if (!match) throw new Error('wrong_credentials');

        delete user._doc.password;
        return user;
    } catch (error) {
        throw error;
    }
};