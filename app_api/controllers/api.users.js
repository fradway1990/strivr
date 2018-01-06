'use strict';
var express=  require('express');
var mongoose = require('mongoose');
var request = require('request');
require('../models/schemas/userSchema.js');
var User = mongoose.model('User');

function sendResponseJson(res,status,content){
  res.status(status);
  res.json(content);
}
module.exports.createUser = function(req,res,next){
  //grab all values from request
  var username = req.body.username;
  var password = req.body.password;
  var useremail = req.body.useremail;
  var passwordConfirmation = req.body.passwordconfirmation;
  var favoriteFood = req.body.favoriteFood;

  //if honeypot is filled in send back an error
  if(favoriteFood.trim() !== ''){
    sendResponseJson(res,400,{message:'Something went wrong while trying to add user.'});
    return;
  }

  //if all valid fields have a value test those values
  //else send back an error
  if(username && password && useremail && passwordConfirmation){
    var validate = User.validateSignUp(username,useremail,password,passwordConfirmation,function(err,errObject,isValid){
      if(err){
        return sendResponseJson(res,400,err);
      }
      if(isValid){

        var userData = {
          username: username,
          password: password,
          email: useremail.toLowerCase(),
          verified:true
        }
        User.create(userData,function(err,user){
          if(err){
            return sendResponseJson(res,400,{all:err.message});
          }
          return sendResponseJson(res,200,user);
        });
      }else{
        return sendResponseJson(res,400,errObject);
      }
    });
  }else{
    return sendResponseJson(res,400,{all:'All fields are required.'});
  }
}

//find user for login
module.exports.findOne = function(req,res,next){
  if(req.params.userId && req.params){
    //if userid does not match assume that search is being done by username
    User.findOne({_id:req.params.userId})
    .select('-password -email')
    .exec(function(err,user){
      if(err){
        return sendResponseJson(res,400,err);
      }

      if(!user){
        return sendResponseJson(res,404,{message:'User not found.'});
      }
      return sendResponseJson(res,200,user);
    });
  }else{

    return sendResponseJson(res,400,{message:'User id not provided'});
  }
}
//find user
module.exports.authenticateUser = function(req,res,next){
  if(req.body.favoriteFood.trim() !== ''){
    return sendResponseJson(res,400,{message:'Something went wrong while processing this request.'});
  }
  if(req.body.username && req.body.password){
    var username = req.body.username;
    var userpass = req.body.password;
    User.authenticate(username,userpass,function(err,user){
      if(err){
        return sendResponseJson(res,401,err);
      }
      console.log('thisUser:'+user)
      return sendResponseJson(res,200,user);
    })
  }else{
    return sendResponseJson(res,400,{message:'All fields must be provided'});
  }
}
