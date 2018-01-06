var moment = require('moment');
var request = require('request');
module.exports.getGoals = function(object,callback){

  var apiOptions = {
    server : "http://localhost:3000"
  };

  var userId = object.userId;
  if(typeof object.earliest !== 'undefined'){
    var earliest = object.earliest;
  }else{
    var earliest = moment().utc().startOf('day').toISOString();
  }
  if(typeof object.latest !== 'undefined'){
    var latest = object.latest;
  }else{
    var latest = moment().utc().endOf('day').toISOString();
  }

  if(typeof object.limit !== 'undefined'){
    var limit = object.limit;
  }else{
    var limit = 1000;
  }

  if(typeof object.completed !== 'undefined'){
    if(typeof object.completed === "boolean"){
       var completed = object.completed.toString();
    }else{
       var completed = 'null';
    }
  }else{
    var completed = 'null';
  }

  var path = '/api/goals/'+userId;

  var requestOptions = {
                  url:apiOptions.server+path+'?'+'earliest='+earliest+'&latest='+latest+'&limit='+limit+'&completed='+completed,
                  method:'GET',
                  json:{}
                };
  request(requestOptions,function(error,response,body){
    callback(error,response,body)
  });
}
