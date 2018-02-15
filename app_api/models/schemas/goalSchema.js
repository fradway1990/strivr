'use strict';
var mongoose = require('mongoose');
var moment = require('moment');
var goalSchema = new mongoose.Schema({
  goalName: {type:String, required:true},
  createdOn:{type:Date,required:true,default:Date.now},
  startDate:{type:Date,required:true, default: Date.now},
  createdBy:{ type : mongoose.Schema.Types.ObjectId , ref: 'User',required:true },
  tasks:[{ type : mongoose.Schema.Types.ObjectId , ref: 'task',required:true }],
});


//validate goal
goalSchema.statics.validateGoal = function(goal,callback){

  var isValid = true;
  var Goal = this;
  var goal = goal;
  var errorObject = {};
  var tasks = goal.tasks;
  console.log(goal);
  //checks to see if goal name is empty
  function checkGoalName(){
    return new Promise(function(resolve,reject){
      if(goal.goalName.trim() !== ''){
        resolve();
      }else{
        isValid = false;
        errorObject.message = 'Please enter a name for your goal.';
        reject(errorObject);
      }
    });
  }

  function checktasks(){

    return new Promise(function(resolve,reject){

      for(var x = 0; x < tasks.length;x++){
        var task = tasks[x];
        if(task.taskText.trim() === ''){
          isValid = false;
          errorObject.message = 'Task text must not be left blank.';
          return reject(errorObject);
        }

        if(!moment.date(task.date).isValid()){
          isValid = false;
          errorObject.message = 'Task dates must be in a valid format.';
          return reject('errorObject');
        }
      }

      resolve();
    });
  }

  Promise.all([checkGoalName(),checktasks()]).then(function(){
    callback(errorObject,isValid,goal);
  }).catch(function(){
    callback(errorObject,isValid,goal);
  });
}


var Goal = mongoose.model('Goal',goalSchema);
