import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;


/**
 * Middleware pour vérifier la validité d'un token JWT.
 *
 * @async
 * @function checkJWT
 * @param {Object} req - Objet de requête Express.
 * @param {Object} req.cookies - Cookies de la requête.
 * @param {string} req.cookies.token - Token JWT présent dans les cookies.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction de rappel pour passer au middleware suivant.
 * @returns {void}
 */
export const checkJWT = async (req, res, next) => {
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