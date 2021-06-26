const express = require('express');
const HttpError = require('../models/http-error.js');
const ResultControllers = require('../controllers/result-controllers');
const checkAuth = require('../middleware/auth-check');

// luodaan tänne reititys results resurssille

const router = express.Router();

//Ei valitoida tokenia vasten
router.get('/amateurs/', ResultControllers.getAmateursResults);

//tässä kutsutaan tokenin validointia
router.use(checkAuth);

//Nämä vaativat autentikoituneen käyttäjän (tokenin tarkistus)
router.get('/professionals/', ResultControllers.getProfessionalsResults);
router.post('/own-results/:_id/', ResultControllers.getResultsByUser);
router.patch('/:_id/', ResultControllers.editResults);
router.post('/:_id/', ResultControllers.addNewWorkout);
router.delete('/:_id/', ResultControllers.deleteWorkout);

module.exports = router;