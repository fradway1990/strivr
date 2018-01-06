var express = require('express');
var request = require('request');
var calendar = require('./renderCalendar');

var apiOptions = {
  server : "http://localhost:3000"
};
var sendResponseJson = function(res,status,content){
  res.status(status);
  res.json(content);
}

module.exports.renderGoalCreate = function(req,res,next){
  res.render('create-goal',{
    page:'goal',
    title:'Create Goal'
  });
}

module.exports.sendCalendar = function(req,res){
  var startDate;
  if(typeof req.body.startDate !== 'undefined'){
    startDate = req.body.startDate;
  }
  sendResponseJson(res,200,calendar.renderCalendar(startDate));
}

module.exports.createGoal = function(req,res,next){
  var goal = req.body;
  var path = '/api/goals/'+req.session.userId;
  var requestOptions = {
    url:apiOptions.server+path,
    json:{
      goal:goal
    },
    method:'POST'
  }
  request(requestOptions,function(error,response,body){
    if(error){
      return next(error);
    }
    if(response.statusCode === 200){
      return sendResponseJson(res,200,{
        goalId:response.body._id,
        message:response +' has been created.'
      });
    }
    return sendResponseJson(res,400,{'message':'An error occurred while trying to create goal.'});
  });
}
