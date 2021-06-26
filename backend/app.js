const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error.js');

const resultsRoutes = require('./routes/results-routes');
const usersRoutes = require ('./routes/users-routes');


// routermäärittelyt tänne

const app = express();

app.use(bodyParser.json());

// sallitaan CORS-pyynnöt ja autentikointi
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next(); //Jatketaan suoritusta seuraaville mw:lle
});

// tänne reitityskutsut
app.use('/api/users', usersRoutes);
app.use('/api/results', resultsRoutes);


// olemattomien osoitteiden käsittely tänne
app.use((req, res, next) => {
    const error = new HttpError('Could not find route', 404);
    next(error);
});

// ketjun viimeinen virhekäsittelijä tänne
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error); //Virhe seuraavaan virhekäsittelijään
    }

    res.status(error.code || 500) //joko asetettu error tai jos sitä ei ole niin 500
    .send({message: error.message || 'Unknown error' }); //jos on valmiiksi asetettu error message niin lähetetään se, muutoin 'Unknown error'
});

const uri ='mongodb+srv://dbuser:YjSJ8xjCzXC1YL3v@cluster0.plzde.mongodb.net/UserDB?retryWrites=true&w=majority';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// MongoDB:n yhteyskuvaaja ja optioiden määrittelyt tänne
mongoose
    .connect(uri, options)
    .then(() => { //Jos yhdistäminen kantaan onnistuu, voidaan käynnistää palvelu
        app.listen(5000);
    })
    .catch(err => { //Annetaan virheviesti, jos yhdistäminen ei onnistu
        console.log(err);
    });