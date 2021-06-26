const HttpError = require('../models/http-error.js');
const Workout = require('../models/workout-model');

const parseJwt = (token, person) => { //Parsitaan tokeniin tallennetut tiedot
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = Buffer.from(base64, 'base64').toString();

        let payload=JSON.parse(jsonPayload);
        if(payload.email==person){ //Tarkistetaan, onko tokeniin tallennettu sähköpostiosoite sama kuin kirjautuneen henkilön sähköpostiosoite userContextissa
            console.log("sama henkilö");
            return true;
        } else {
            console.log("eri henkilö");
            return false;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getAmateursResults = async (req, res, next) => { //haetaan harrastajien tulokset tietokannasta
    let results;
    try{
        results = await Workout.find({userType: "amateur"});
    } catch (err){
        const error = new HttpError(
            "Could not find the results",
            500
        );
        return next(error);
    }
    res.json(results)
};

const getProfessionalsResults = async (req, res, next) => { //haetaan ammattilaisten tulokset tietokannasta
    let results;
    try{
        results = await Workout.find({userType: "professional"});
    } catch (err){
        const error = new HttpError(
            "Could not find the results",
            500
        );
        return next(error);
    }
    res.json(results)
};

const getResultsByUser = async (req, res, next) => { //haetaan kirjautuneen käyttäjän tulokset tietokannasta
    const {email, token} = req.body; //Pyynnössä tulee nämä kentät
    let results;
    let user = parseJwt(token, email); //Lähetetään metodille token ja kirjautuneen henkilön sähköpostiosoite (tallennettu userContextiin, kun käyttäjä kirjautuu sisään)
    if(user===true){
    try{
        results = await Workout.find({person: email});
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, can't fetch results",
            500
        );
        return next(error);
    }
    if(!results || results.length == 0) {
        const error = new HttpError (
            "Could not find any results",
            404
        );
        return next(error);
    }
} else {
    const error = new HttpError(
        "Something went wrong, try again later", 
        500
    );
    return next(error);
}
    res.json(results);
};

const editResults = async (req, res, next) => { //muokataan valitun treenin tietoja
    const {id, date, sport, times, weight, person, token} = req.body; //Pyynnössä tulee nämä kentät
    let user = parseJwt(token, person); //Lähetetään metodille token ja kirjautuneen henkilön sähköpostiosoite (tallennettu userContextiin, kun käyttäjä kirjautuu sisään)
    let workout;

    if(user===true){
        try {
            workout = await Workout.findById(id);
        } catch (err) {
            const error = new HttpError(
                "Could not edit results",
                500
            );
            return next(error);
        }
        if(workout){ //Tallennetaan uudet tiedot valittuun treeniin
            workout.date = date;
            workout.sport = sport;
            workout.times = times;
            workout.weight = weight;
            workout.id = id;
            try{
                await workout.save();
            } catch (err) {
                const error = new HttpError(
                    "Could not edit the results",
                    500
                );
                return next(error);
            }
        } else {
            const error = new HttpError(
                "Could not find the workout",
                404
            );
            return next(error);
        }
    } else {
        const error = new HttpError(
            "Something went wrong, try again later", 
            500
        );
        return next(error);
    }
    res.json({workout: workout.toObject({getters: true})});
};

const deleteWorkout = async (req, res, next) => { //poistetaan valittu treeni
    const {option, person, token} = req.body; //pyynnössä tulee nämä kentät
    let workout;
    let user = parseJwt(token, person); //Lähetetään metodille token ja kirjautuneen henkilön sähköpostiosoite (tallennettu userContextiin, kun käyttäjä kirjautuu sisään)
    
    if(user===true){
        try {
            workout = await Workout.findById(option);
        } catch {
            const error = new HttpError(
                "Could not delete workout",
                500
            );
            return next(error);
        }
        if (workout) {
            try {
                await workout.remove();
            } catch (err) {
                const error = new HttpError(
                    "Could not find the workout", 
                    404
                );
            }
        } else {
            const error = new HttpError(
                "Could not delete workout", 
                500
            );
        }
    } else {
        const error = new HttpError(
            "Something went wrong, try again later", 
            500
        );
        return next(error);
    }
    res.status(200).json({message: "Workout deleted"});
};

const addNewWorkout = async (req, res, next) => { //lisätään uusi treeni
    const {date, sport, times, weight, person, userType, token} = req.body; //pyynnössä tulee nämä kentät
    const addedWorkout = new Workout ({
        date,
        sport,
        times,
        weight,
        person,
        userType
    });

    let user = parseJwt(token, person); //Lähetetään metodille token ja kirjautuneen henkilön sähköpostiosoite (tallennettu userContextiin, kun käyttäjä kirjautuu sisään)
    if(user===true){
        try {
            await addedWorkout.save(); //tallentaa treenin tietokantaan
        } catch (err){
            const error = new HttpError(
                "Could not add a new workout",
                500
            );
            return next(error);
        }
    } else {
        const error = new HttpError(
            "Something went wrong, try again later", 
            500
        );
        return next(error);
    }
    res
    .status(201)
    .json(addedWorkout); 
};

exports.getAmateursResults = getAmateursResults;
exports.getProfessionalsResults = getProfessionalsResults;
exports.getResultsByUser = getResultsByUser;
exports.editResults = editResults;
exports.addNewWorkout = addNewWorkout;
exports.deleteWorkout = deleteWorkout;