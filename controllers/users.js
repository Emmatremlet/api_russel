const userService = require('../services/users');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


exports.add = async (req, res, next) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    try {
        await userService.add(userData);
        res.redirect('/users/signin');
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email
    };

    try {
        await userService.update(req.params.id, userData);
        res.redirect('/users/' + req.params.id + '/account');
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.authenticate = async (req, res) => {
    const temp = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const user = await userService.authenticate(temp);
        const expireIn = 24 * 60 * 60;
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: expireIn });
        res.cookie('token', 'Bearer ' + token, { httpOnly: true, maxAge: expireIn * 1000 });
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};