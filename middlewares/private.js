const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.token;
    if (!!token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }

   if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.user = decoded.user; 
                next();
            }
        });
    } else {
        next(); 
    }
};