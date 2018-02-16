'use strict'
var express = require('express');
var request = require('request');
var moment = require('moment');
var Goals = require('./includes/getGoals');
var apiOptions = {
  server : process.env.PRODUCTION_URI || "http://localhost:3000"
};

var sendResponseJson = function(res,status,content){
  if(!res.headersSent){
    res.status(status);
    res.json(content);
  }
}
module.exports.renderSignUp = function(req,res,next){

  res.render('register',{
    title:'Striv4',
    choice:'sign-in',
    page:'register'
  });
}

module.exports.createUser = function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  var useremail = req.body.useremail;
  var passwordConfirmation = req.body.passwordconfirmation;
  var favoriteFood = req.body.favoriteFood;
  var path = '/api/users';
  var requestOptions = {
                        url: apiOptions.server + path,
                        method:'POST',
                        json : {username: username,
                                useremail:useremail,
                                password:password,
                                passwordconfirmation: passwordConfirmation,
                                favoriteFood:favoriteFood
                              }
                      }
  request(requestOptions,function(error,response,body){
    if(error){
      return next(error);
    }
    if(response.statusCode === 200){
      req.session.userId = response.body._id;
      req.session.username = response.body.username;
      return sendResponseJson(res,200,{redirect:'/user'});
    }
    if(response.statusCode === 400){
      return sendResponseJson(res,400,response.body);
    }
  });
}

module.exports.renderProfile = function(req,res,next){
  if(req.session && req.session.userId){
    var path = '/api/users/'+ req.session.userId;
    var requestOptions ={
      url:apiOptions.server + path,
      method:'GET',
      json:{}
    }
    request(requestOptions,function(error,response,body){
      if(error){
        return next(error);
      }

      if(response.statusCode === 200){
        var renderInfo = {
          title:response.body.username+'\'s Profile',
          page:'profile',
          user:{
            username:response.body.username,
            userId:response.body._id
          }
        };
        //get todays Goals

        var earliest = moment.utc().startOf('day').toISOString();
        var latest = moment.utc().endOf('day').toISOString();
        var goalOptions = {userId: response.body._id, earliest: earliest, latest: latest,completed:false};
        Goals.getGoals(goalOptions,function(err,response,todaysGoals){
          if(err || response.statusCode !== 200){
            var goalError = {goalError: "There was a problem retreiving your goals." };
            renderInfo.user.goals = goalError;
            return  res.render('profile',renderInfo);
          }

          renderInfo.user.goals = todaysGoals;
          res.render('profile',renderInfo);

        });




      }

      if(response.statusCode === 404){
        var error = new Error(response.body.message);
        error.status = 404;
        error.message = response.body.message;
        next(error);
      }
      if(response.statusCode === 400){
        var error = new Error();
        error.status = 400;
        error.message = response.body.message;
        next(error);
      }
    });
  }else{
    res.redirect('/');
  }
}

module.exports.login = function(req,res,next){
  var username = req.body.username;
  var password =req.body.password;
  var favoriteFood = req.body.favoriteFood;
  var path = '/api/users/auth/login'
  var requestOptions = {
                      url : apiOptions.server + path,
                      method:'GET',
                      json:{
                        username: username,
                        password:password,
                        favoriteFood:favoriteFood
                      }
                  };
  request(requestOptions,function(error,response,body){
    if(error){
      return next(error);
    }
    if(response.statusCode === 401){
      return sendResponseJson(res,401,response.body.message);
    }
    req.session.userId = response.body._id;
    req.session.username = response.body.username;
    return sendResponseJson(res,200,{});
  });
}

module.exports.logout = function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};
