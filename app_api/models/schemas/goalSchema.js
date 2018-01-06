'use strict';
var mongoose = require('mongoose');
var moment = require('moment');
var goalSchema = new mongoose.Schema({
  goalName: {type:String, required:true},
  createdOn:{type:Date,required:true,default:Date.now},
  startDate:{type:Date,required:true, default: Date.now},
  createdBy:{ type : mongoose.Schema.Types.ObjectId , ref: 'User',required:true },
  events:[{ type : mongoose.Schema.Types.ObjectId , ref: 'Event',required:true }],
});


//validate goal
goalSchema.statics.validateGoal = function(goal,callback){

  var isValid = true;
  var Goal = this;
  var goal = goal;
  var errorObject = {};
  var events = goal.events;

  //checks to see if goal name is empty
  function checkGoalName(){
    return new Promise(function(resolve,reject){
      if(goal.goalName.trim() !== ''){
        resolve(errorObject);
      }else{
        isValid = false;
        errorObject.goalName = 'Please enter a name for your goal.';
        resolve(errorObject);
      }
    });
  }

  function checkEvents(){
    return new Promise(function(resolve,reject){
      for(var x = 0; x < events.length;x++){
        //first check to see if each event has an event text that is not empty
        var evt = events[x];
        var dates = evt.date;
        if(typeof evt.eventText === 'undefined' || evt.eventText.trim() === ''){
          isValid = false;
          errorObject.event = 'One of your events has an empty text field.';
          resolve(errorObject);
          break;
        }
        //make sure that event length is the same as the date length
        evt.eventLength = dates.length;
        if(dates.length > 90 || dates.length < 1){
          datesValid = false;
          if(dates.length < 1){
            errorObject.event = 'One of your events is too short.';
          }else{
            errorObject.event = 'One of your events extends over 90 days.';
          }
          resolve(errorObject);
          break;
        }else if(dates.length > 1){
          evt.eventType = 'multiDay'
        }else if(dates.length === 1){
          evt.eventType = 'singleDay';
        }
        var eventsValid = validateDates(goal.startDate,dates);
        if(!eventsValid){
          isValid = false;
          errorObject.event = 'One of your event dates is invalid.'
          resolve(errorObject);
          break;
        }
      }
      resolve(errorObject);
    });
  }

  Promise.all([checkGoalName(),checkEvents()]).then(function(){
    callback(errorObject,isValid,goal);
  });
}
function validateDates(startDate,dates){
  var datesValid = true;
  var startDate = moment.utc(startDate).set({hour:0,minute:0,second:0,millisecond:0});

  for(var x = 0; x < dates.length;x++){
    var date = dates[x];
    if(moment.utc(date).isValid() !== true){
      datesValid = false;
      console.log('date is not in valid format\n');
      break;
    }
    if(moment.utc(date).hour() !== 0 || moment.utc(date).minute() !== 0 || moment.utc(date).second() !== 0 || moment.utc(date).millisecond() !== 0){
      datesValid = false;
      console.log('event dates not at midnight\n');
      return;
    }
  }

  return datesValid;
}

var Goal = mongoose.model('Goal',goalSchema);
