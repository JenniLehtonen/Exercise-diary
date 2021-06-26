const mongoose = require('mongoose'); //Otetaan käyttöön mongoose

const Schema = mongoose.Schema; //Schema-muuttuja

const workoutSchema = new Schema ({
    date: {type: Date, default: Date.now, required: true}, 
    sport: {type: String, required: true},
    times: {type: Number, required: true},
    weight: {type: Number, required: true},
    person: {type: String, required: true},
    userType: {type: String, required: true}
})

module.exports = mongoose.model('workout', workoutSchema);
