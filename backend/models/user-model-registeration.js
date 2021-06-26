const mongoose = require('mongoose'); //Otetaan käyttöön mongoose

const Schema = mongoose.Schema; //Schema-muuttuja

const registerUserSchema = new Schema ({
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email: {type:String, required: true},
    userType: {type:String, required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('userRegisteration', registerUserSchema);