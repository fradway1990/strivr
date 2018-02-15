var express = require('express');
var userMid = require('../../middleware/userMiddleware');
var serverUserController = require('../controllers/users.server.controller');
var serverGoalController = require('../controllers/goals.server.controller')
var router = express.Router();


//user routes
router.get('/',userMid.loggedOut,serverUserController.renderSignUp);
router.post('/signUp',serverUserController.createUser);
router.post('/signIn',userMid.loggedOut,serverUserController.login);
router.get('/signOut',userMid.requiresLogin,serverUserController.logout);
router.get('/user',serverUserController.renderProfile);

//goal routes
router.get('/goal/create',userMid.requiresLogin,serverGoalController.renderGoalCreate);
router.post('/goal',userMid.requiresLogin,serverGoalController.createGoal);

//misc routes
router.post('/sendCalendar',userMid.requiresLogin,serverGoalController.sendCalendar);
module.exports = router;
