const express=require('express');
const router=express.Router()   
const authcontroller=require("../controllers/auth.controller")
const validateResult=require('../middlewares/validation.middleware')

router.post('/register', validateResult.registerUser, authcontroller.registerUser);
router.post('/login', authcontroller.loginuser);
router.post('/logout', authcontroller.logoutuser);
module.exports = router;
