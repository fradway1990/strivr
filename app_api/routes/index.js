var express = require('express');
var goals = require('../controllers/api.goals.js');
var users = require('../controllers/api.users.js');
var userMid = require('../../middleware/userMiddleware');
var router = express.Router();
//user routes
router.post('/users',users.createUser);
router.get('/users/:userId',users.findOne);
router.get('/users/auth/login',users.authenticateUser);
//router.get('/:userId/goals',users.getGoals);

//goals routes
router.post('/goals/:userId',goals.createGoal);
router.get('/goals/:userId',goals.getGoals);
router.put('/goals/:userId/:taskId',goals.completeGoal);

module.exports = router;
