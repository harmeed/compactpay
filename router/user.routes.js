const { Router } = require('express');
const express = require('express');
const { userSignup, userLogin, updateKyc, getUserByEmail } = require('../controller/user.controller');
const router = express.Router();

router.post('/signup',userSignup);

router.post('/login',userLogin);

router.put('/update',updateKyc);

router.get('/email', getUserByEmail);

module.exports = router;
