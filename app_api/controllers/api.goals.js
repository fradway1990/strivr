var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
require('../models/schemas/goalSchema');
require('../models/schemas/userSchema');
require('../models/schemas/eventSchema');
var Evt = mongoose.model('Event');
var Goal = mongoose.model('Goal');
var User = mongoose.model('User');

function sendResponseJson(res,status,content){
  if(!res.headersSent){
    res.status(status);
    res.json(content);
  }
}

function deleteGoal(goalId){
  console.log('deleting goals.');
  Goal.findByIdAndRemove(goalId,function(err,deletedGoal){
  });

}
module.exports.createGoal = function(req,res,next){
  if(req.params && req.params.userId){
      var goalBody = req.body.goal;
      var userId = req.params.userId;
      if(typeof goalBody.events === 'string'){
        var events = JSON.parse(goalBody.events);
        goalBody.events = events;
      }

      //first validate goal
      Goal.validateGoal(goalBody,function(errorObject,isValid,goal){
        if(!isValid){
          console.log('not valid')
          return next(errorObject);
        }
        console.log('is valid');
        var goalId = mongoose.Types.ObjectId();
        var goalStart = moment.utc().set({hour:0,minute:0,second:0,millisecond:0});
        var newGoal = new Goal({
          _id: goalId,
          goalName: goal.goalName,
          createdOn:goalStart,
          startDate:goalStart,
          createdBy:userId,
          events:[]
        });
        for(var x = 0; x < goal.events.length; x++){
          var siblingId = mongoose.Types.ObjectId();
          for(var y = 0; y < goal.events[x].date.length;y++){
            var evtId = mongoose.Types.ObjectId();
            var evt = new Evt({
              _id: evtId,
              eventText: goal.events[x].eventText,
              eventType: goal.events[x].eventType,
              date:goal.events[x].date[y],
              eventLength: goal.events[x].eventLength,
              siblingId: siblingId,
              parentId: goalId
            });
            newGoal.events.push(evtId);
            Evt.create(evt,function(err,doc){
              if(err){
                sendResponseJson(res,400,err);
              }
            });
          }
        }

        Goal.create(newGoal,function(err,doc){
          if(err){
            console.log('Error encountered making goal');
            sendResponseJson(res,400,err);
          }else{
            User.findOneAndUpdate({_id:userId},{$push: {goals: doc._id}},{upsert:true},function(err,user){
              if(err){
                console.log(err);
                sendResponseJson(res,400,err);
              }else{
                console.log('Goal Added to user');
              }
            });
            console.log('Goal Created');
            sendResponseJson(res,200,doc);
          }
        });

      });//validate goal
  }else{
    sendResponseJson(res,401,{message:"You are not authorized to create goals."});
  }
}

module.exports.getGoals = function(req,res,next){
  if(req.params && req.params.userId){
      var earliest;
      var latest;
      var limit;
      var completed;
      if(typeof req.query.earliest !== 'undefined'){
        var date = moment(req.query.earliest);
        if(date.isValid){
          earliest = moment(req.query.earliest).utc().startOf('day').toISOString();
        }else{
          earliest = moment("1970-1-1").utc().startOf('day').toISOString();
        }
      }else{
        earliest = moment("1970-1-1").utc().startOf('day').toISOString();
      }

      if(typeof req.query.latest !== 'undefined'){
        var date = moment(req.query.latest);
        if(date.isValid){
          latest = moment(req.query.latest).utc().endOf('day').toISOString();
        }else{
          latest = moment("3000-1-1").utc().endOf('day').toISOString();
        }
      }else{
        latest = moment("3000-1-1").utc().endOf('day').toISOString();
      }

      if(typeof req.query.limit !== 'undefined'){
        if(req.query.limit || Number.isInteger(parseInt(req.query.limit))){
          limit = parseInt(req.query.limit);
        }else{
          limit = 1000;
        }
      }else{
        limit = 1000;
      }

      if(typeof req.query.completed !== 'undefined'){
        if(req.query.completed === 'true'){
          completed = true;
        }else if(req.query.completed === 'false'){
          completed = false;
        }else{
          completed = 'null';
        }
      }else{
        completed = 'null';
      }
      console.log(completed)
    var userId = req.params.userId;


    Goal.find({createdBy:userId}).limit(limit).exec(function(err,goals){
      if(err){
        console.log(err);
      }else{


        var goalArr =JSON.parse(JSON.stringify(goals));
        function mergeToGoal(count){
          if(count < 1){
            return sendResponseJson(res,200,goalArr);
          }
          console.log(earliest);
          console.log(latest);
          goalArr.forEach(function(goal,i){
            var queryParams = {
              parentId: goal._id,
              date: {$gte: new Date(earliest), $lte:new Date(latest)},
            }
            if(typeof completed === "boolean"){
              queryParams.completed = completed;
            }
            Evt.find(queryParams).limit(limit).exec(function(err,evt){
              if(err){
                console.log(err);
              }else{
                var evtArr =JSON.parse(JSON.stringify(evt));
                evtArr = evtArr.map(function(evt){return evt});
                goal.events = evtArr;
                goal.daysSinceGoalStart = moment().utc().startOf('day').diff(moment(goal.goalStart).utc().startOf('day'),'days')+1;
                mergeToGoal(count - 1);
              }
            });
          });
        }
        mergeToGoal(goalArr.length);

      }

    });

  }
}

module.exports.completeGoal = function(req,res){
  if(req.params && req.params.userId && req.params.eventId){
    Evt.find({_id: req.params.eventId,completed:false},function(err,evt){
      if(err){
        console.log('couldnt find #1 event');
        return sendResponseJson(res,404,err);
      }
      //find parent and determin if user id matches
      Goal.find({createdBy:req.params.userId,events:evt._id}).exec(function(err,goal){
        if(err){
          console.log('couldnt find goal');
          return sendResponseJson(res,404,err);
        }
        Evt.update({_id: req.params.eventId,completed:false},{completed:true},{ upsert: true },function(err,evt){
          if(err){
            console.log('couldnt delete event');
            return sendResponseJson(res,404,err);
          }
          return sendResponseJson(res,200,evt);
        });
      });
    })
  }else{
    sendResponseJson(res,400,{message: 'Please include event id and user id'});
  }
}
