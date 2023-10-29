const express = require('express');
const authController = require('../controllers/auth');
const usersData = require('../controllers/usersData');


const router= express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/usersData', usersData.usersData );
//router.post('/userProfile', authController.userProfile);

 module.exports=router;