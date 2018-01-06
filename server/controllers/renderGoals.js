'use strict';
var moment = require('moment');
var request = require('request');
var Goals = require('./includes/getGoals');
var apiOptions = {
  server : "http://localhost:3000"
};
module.exports.renderGoals = function(userId,isUser,callback){
  console.log('getting Goals');
  var path = '/api/users/'+userId;
  var requestOptions = {
                      url : apiOptions.server + path,
                      method:'GET',
                      json:{}
                  };
  request(requestOptions,function(error,response,body){
    if(error){
      return callback(error,null);
    }
    if(response.statusCode !== 200){
      //handle errors
    }

    var user = body;
    var earliest = moment.utc().startOf('day').toISOString();
    var latest = moment.utc().endOf('day').toISOString();

    //get todays goals
    var goalOptions = {userId: user.id, earliest: earliest, latest: latest};

    Goals.getGoals(goalOptions,function(err,response,todaysGoals){
      var todaysGoals = todaysGoals;
      //goals in the next 10 days
      var earliest = moment.utc().add(1, 'days').startOf('day').toISOString();
      var latest = moment.utc().add(10, 'days').endOf('day').toISOString();
      goalOptions = {userId:user.id, earliest:earliest , latest:latest};
      Goals.getGoals(goalOptions,function(err,response,upcomingGoals){
        var upcomingGoals = upcomingGoals;


        var html = '';
        var userGoals = user.goals;
        var noun;
        if(isUser){
          noun = 'You are';
        }else{
          noun = user.username+' is';

        }
        if(userGoals.length === 0){
          html+="<div class='row'>";
          html+="<div class='col-xs-12 col-sm-12 col-md-6 col-lg-4 col-md-offset-3 col-lg-offset-4'>";
          html+="<div class='create-or-search-goal'>";
          html+= '<h3>'+noun+' not pursuing any goals.</h3>';
          if(isUser){
            html+="<button type='button' class='button create-goal'><a href='/goal/create'>Create Goal</a></button>";
          }
          html+="</div></div></div>";
          return callback(null,html);
        }
        var todaysDate = moment.utc().startOf('day').toISOString();
        var g = 'goal';
        if(userGoals.length > 1){
          var g = 'goals';
        }


        html+="<div class='row'>";
          html+="<h3 class='center'>You are Pursuing "+ userGoals.length +" "+g+".</h3>";

            for(var x = 0; x < todaysGoals.length; x++){
                html+="<div class='col-xs-12 col-md-12'>";
                  html+="<div class='current-goal'>";
                    html+="<h4>"+todayGoals[x].goalName+"</h4>";

                  html+="</div>";
                html+="</div>";
            }




        html+="</div>";
        return callback(null,html);

      });
    });

  });

}
