const express = require('express');
const { userSignup, userLogin, updateKyc, getUserByEmail, transactionPin, forgotPassword, resetPassword, otpVerification, getAll, getAllUser } = require('../controller/user.controller');
const router = express.Router();

router.post('/signup',userSignup);

router.post('/login',userLogin);

router.put('/update',updateKyc);
router.put('/transpin',transactionPin);
router.put('/forgotpassword',forgotPassword);
router.put('/resetpassword',resetPassword);
router.put('/otpVerification', otpVerification);

router.get('/all', getAllUser);
router.get('/:email', getUserByEmail);


module.exports = router;
