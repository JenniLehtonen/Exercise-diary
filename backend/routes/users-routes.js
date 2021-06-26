const express = require('express');
const HttpError = require('../models/http-error.js');
const UserControllers = require('../controllers/user-controllers');

// luodaan tänne reititys users resurssille

const router = express.Router();


router.post('/login/', UserControllers.checkLoginCredentials);
router.post('/register/', UserControllers.registerUser);

module.exports = router;

