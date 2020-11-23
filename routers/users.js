const express = require('express');
//const router = express.Router;
const router = require('express-promise-router')();
const UserController = require('../controllers/users');
const {validateBody, schemas} =require('../helpers/routerHelpers');
const passport = require('passport');
const passportConf = require('../passport');

router.route('/signup')
.post(validateBody(schemas.authSchema), UserController.signUp);

router.route('/signin')
.post(validateBody(schemas.authSchema),passport.authenticate('jwt',{session:false}), UserController.signIn);

router.route('/secret')
.get(passport.authenticate('jwt',{session:false}) ,UserController.secret);

module.exports = router;