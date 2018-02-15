var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
require('../models/schemas/goalSchema');
require('../models/schemas/userSchema');
require('../models/schemas/taskSchema');
var Task = mongoose.model('Task');
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
      if(typeof goalBody.tasks === 'string'){
        var tasks = JSON.parse(goalBody.tasks);
        goalBody.tasks = tasks;
      }

      //first validate goal
      Goal.validateGoal(goalBody,function(errorObject,isValid,goal){
        if(!isValid){
          return sendResponseJson(res,400,errorObject);
        }
        var goalId = mongoose.Types.ObjectId();
        var goalStart = moment.utc().startOf('day');
        var goalData = {
          _id: goalId,
          goalName: goal.goalName,
          createdOn:goalStart,
          startDate:goalStart,
          createdBy:userId,
          tasks:[]
        }


        for(var x = 0; x < goal.tasks.length; x++){
          var task = goal.tasks[x];
          var taskId = mongoose.Types.ObjectId();
          var newTask = new Task({
            date: task.date,
            completed:false,
            taskText:task.taskText,
            parentId: goalId,
            _id:taskId
          });
          goalData.tasks.push(taskId);
          Task.create(newTask,function(err,doc){
            if(err){
              return sendResponseJson(res,400,err);
            }else{

            }
          });
        }
        var newGoal = new Goal(goalData);
        Goal.create(newGoal,function(err,doc){
          if(err){
            sendResponseJson(res,400,err);
          }else{
            User.findOneAndUpdate({_id:userId},{$push: {goals: doc._id}},{upsert:true},function(err,user){
              if(err){
                return sendResponseJson(res,400,err);
              }else{
                return sendResponseJson(res,200,doc);
              }
            });

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
    var userId = req.params.userId;


    Goal.find({createdBy:userId}).limit(limit).exec(function(err,goals){
      if(err){
        console.log(err);
      }else{


        var goalArr =JSON.parse(JSON.stringify(goals));
        console.log(goalArr);
        var promises = goalArr.map(function(goal){

          return new Promise(function(resolve,reject){
            var queryParams = {
              parentId: goal._id,
              date: {$gte: new Date(earliest), $lte:new Date(latest)},
            }

            if(typeof completed === "boolean"){
              queryParams.completed = completed;
            }

            Task.find(queryParams).limit(limit).exec(function(err,task){
              if(err){
                reject(err);
              }else{
                var taskArr =JSON.parse(JSON.stringify(task));
                goal.tasks = taskArr;
                resolve();
              }
            });
          });

        });

        Promise.all(promises).then(function(){
          return sendResponseJson(res,200,goalArr);
        }).catch(function(err){
          return sendResponseJson(res,500,err);
        });


      }

    });

  }
}

module.exports.completeGoal = function(req,res){
  if(req.params && req.params.userId && req.params.taskId){
    Task.find({_id: req.params.taskId,completed:false},function(err,task){
      if(err){
        return sendResponseJson(res,404,err);
      }
      //find parent and determine if user id matches
      Goal.find({createdBy:req.params.userId,tasks:task._id}).exec(function(err,goal){
        if(err){
          return sendResponseJson(res,404,err);
        }
        Task.update({_id: req.params.taskId,completed:false},{completed:true},{ upsert: true },function(err,Task){
          if(err){
            return sendResponseJson(res,404,err);
          }
          return sendResponseJson(res,200,Task);
        });
      });
    })
  }else{
    sendResponseJson(res,400,{message: 'Please include task id and user id'});
  }
}
