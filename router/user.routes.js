const express = require('express');
const { userSignup, userLogin, updateKyc, getUserByEmail, transactionPin, forgotPassword, resetPassword } = require('../controller/user.controller');
const router = express.Router();

router.post('/signup',userSignup);

router.post('/login',userLogin);

router.put('/update',updateKyc);
router.put('/transpin',transactionPin);
router.put('/forgotpassword',forgotPassword);
router.put('/resetpassword',resetPassword);

router.get('/:email', getUserByEmail);

module.exports = router;
