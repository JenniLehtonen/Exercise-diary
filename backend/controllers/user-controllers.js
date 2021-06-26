const HttpError = require('../models/http-error.js');

const Registeration = require('../models/user-model-registeration');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs'); //salasanan kryptausta varten
const jwt = require('jsonwebtoken'); //tokenia varten

//Kirjaudutaan sisään
const checkLoginCredentials = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser;
    //tarkistetaan tietokannasta, löytyykö käyttäjätunnusta(sähköpostia)
    try {
        existingUser = await Registeration.findOne({email:email});
    } catch (err) {
        res.status(422)
        .send({message:'email mismatch'});
                return next(err);
    }
    //jos käyttäjätunnusta ei löytynyt
    if(!existingUser){
        const error = new HttpError(
            "Could not find user account. Try again.", 422
            );
        return next(error);
    }
    //tarkistetaan, vastaako käyttäjän antama salasana tietokannasta löytyvää kryptattua salasanaa
    let isValidPassword =false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password); 
    } catch (err){
        const error = new HttpError(
            'Invalid credentials, can not log in', 401
        );
        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError(
            'Invalid credentials, can not log in', 401
        );
        return next(error);
    }

    //käyttäjä on tässä vaiheessa kirjautunut
    let token;
    try{
        token = jwt.sign({email:existingUser.email, usertype:existingUser.userType},
            'salainen_tokenavain',
            {expiresIn: '1h'} //vanhenee tunnissa
            );
    } catch (err){
        const error = new HttpError(
            "Logging in failed, please try again!",
            500 
        );
        return next(error);
    }
    //palautetaan clientille token ja halutut tiedot
    res.status(201).json({token:token, email:existingUser.email, firstname:existingUser.firstname, userType:existingUser.userType});
};

//Rekisteröidytään
const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs, check your data', 422)
        );
    }
    //Löytyykö käyttäjä jo kannasta
    const {firstname, lastname, email, password, userType} = req.body; //pyynnössä tulee nämä kentät
    let existingUser;
    try { //ei saa olla kannassa sähköpostia
        existingUser = await Registeration.findOne({email:email});
    } catch (err){
        const error = new HttpError(
            'Registeration failed, try again', 500
        );
        return next(error);
    }
    // käyttäjä on jo olemassa tietokannassa
    if(existingUser){
        const error = new HttpError(
            'User with that email already exists, login instead', 422
        );
        return next(error);
    }

    //luodaan kryptattu salasana
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err){
        const error = new HttpError(
            'Could not create user, try again!', 500
        );
    }
    
    //luodaan uusi käyttäjä
    const registeredUser = new Registeration ({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        userType //Käyttäjätyyppi: ammattilainen vai harrastaja
    });
    try {
        await registeredUser.save(); //tallentaa käyttäjän tietokantaan
    } catch (err){
        const error = new HttpError(
            "Registeration failed, please try again!",
            500 
        );
        return next(error);
    }
    //käyttäjä on tässä vaiheessa luotu ja se on tietokannassa
    let token;
    try{
        token = jwt.sign({email:registeredUser.email},
            'salainen_tokenavain',
            {expiresIn: '1h'} //vanhenee tunnissa
            );
    } catch (err){
        const error = new HttpError(
            "Registeration failed, please try again!",
            500 
        );
        return next(error);
    }
    //palautetaan clientille token ja halutut tiedot
    res.status(201).json({token:token, email:registeredUser.email});
};

exports.checkLoginCredentials = checkLoginCredentials;
exports.registerUser = registerUser;