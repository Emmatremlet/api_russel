const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;


exports.getById = async (id) => {
  try {
    const user = await User.findById(id).lean(); 
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
  } catch (error) {
    throw error;
  }
};

exports.add = async (req, res, next) => {
    const temp = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    try {
        if (!temp.name || !temp.email || !temp.password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }
        
        const user = await User.create(temp);
        res.redirect('/'); 
    } catch (error) {
        console.log('Erreur lors de la soumission du questionnaire :' + error);
        next(error); 
    }
};

exports.update = async (req, res, next) => {
    const id = req.params.id;
    try {
        let user = await User.findOne({ _id: id });
        if (user) {
            if (req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;

            await user.save();
            return res.redirect('/users/' + user._id + '/account');
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json(error); 
    }
};


exports.delete = async (req, res, next) => {
    const id = req.params.id;
    try {
        await User.deleteOne({ _id: id });
        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}


exports.authenticate = async (req, res, next) => {
    console.log("Tentative d'authentification", req.body);
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, function (err, response) {
                if (err) {
                    return next(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                    SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });
                    
                    res.cookie('token', 'Bearer ' + token, { httpOnly: true, maxAge: expireIn * 1000 });
                                        
                    return res.redirect('/');
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error){
        return next(error);
    }
}