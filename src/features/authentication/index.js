const express = require('express');
const router = express.Router();

const AuthData = require('./data/auth_data');

router.post('/login', AuthData.login);
router.post('/register', AuthData.register);
router.get("/verify/:token", AuthData.verifyEmail);

module.exports = router;
