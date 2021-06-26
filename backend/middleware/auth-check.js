const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

// autentikointi ja autorisointikoodit
module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    try{
        //auth: Bearer token
        const token = req.headers.authorization.split(' ')[1]; //Headerin authorization osassa tulee Bearer token
        if(!token){
            throw new Error('Authorization failed')
        }
        //puretaan token ja jatketaan seuraavaan mw-funktioon
        const decodedToken = jwt.verify(token, 'salainen_tokenavain');
        req.userData = {email: decodedToken.email};
        next();
    } catch (err) {
        const error = new HttpError('Authorization failed', 401);
        return next(error);
    }
}