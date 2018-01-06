'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: {type:String,required:true,trim:true,unique:true},
  password:{type:String,required:true},
  email:{type:String,required:true,unique:true,lowercase:true},
  verified:{type:Boolean,required:true},
  dateCreated:{type:Date,default:Date.now},
  goals:[{type:mongoose.Schema.Types.ObjectId,ref:'Goal'}],
});
userSchema.pre('save',function(next){
  var user = this;
  bcrypt.hash(user.password,10,function(err,hash){
    if(err){
      console.log(err);
      return next(err);
    }else{
      user.password = hash;
      next();
    }
  });
});


userSchema.statics.validateSignUp = function (username, useremail, password, passwordConfirmation, callback) {
  var isValid = true;
  var User = this;
  var errorObject = {};

  function checkUsername(){
    return new Promise(function(resolve,reject){
      console.log('start');
      var userRe = /^[\w-_]{5,20}$/;
      if(username.trim().length < 5){
        isValid = false;
        errorObject.username = 'Username must be at least 5 characters long.'
        return resolve(errorObject);
      }else if(username.trim().length > 20){
        errorObject.username = 'Username must be at least 5 characters long.'
        return resolve(errorObject);
      }else if(!userRe.test(username)){
        errorObject.username = 'Username must be alphanumeric with no spaces hyphens and underscores are allowed.';
        return resolve(errorObject);
      }
      User.findOne({username:new RegExp(username,'i')},function(err,user){
        if(err){
          console.log(err);
          return reject(err);
        }
        if(user){
          isValid = false;
          errorObject.username ='Username is already taken.'
          resolve(errorObject);
        }else{
          resolve(errorObject);
        }
      });

      console.log('end username');
    });
  }
  function checkEmail(){
    return new Promise(function(resolve,reject){
      console.log('start');
      var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(! emailRe.test(useremail)){
        isValid = false;
        errorObject.email = 'Email is not valid';
        return resolve(errorObject);
      }
      User.findOne({email:{$regex:useremail.toLowerCase()}},function(err,user){
        if(err){
          console.log(err);
          return reject(err);
        }
        if(user){
          isValid = false;
          errorObject.email ='Email is already taken';
          resolve(errorObject);
        }else{
          resolve(errorObject);
        }
      });
      console.log('end email');
    });
  }

  function checkPassword(){
    return new Promise(function(resolve,reject){
      console.log('start');
      if(password.length < 5){
        isValid = false;
        errorObject.password = 'Password must be more than 5 chars.';
        return resolve(errorObject);
      }else if(password !== passwordConfirmation){
        isValid = false;
        errorObject.password = 'Passwords do not match';
        resolve(errorObject)
      }else{
        resolve(errorObject);
      }
      console.log('end pass')
    });
  }

  Promise.all([checkUsername(),checkEmail(),checkPassword()]).then(function(){
    console.log(errorObject);
    callback(null,errorObject,isValid);
  }).catch(function(err){
    console.log('catch');
    console.log(err);
    callback(err,null,null);
  });
}

userSchema.statics.authenticate = function(username,password,callback){
  User.findOne({username: username},function(err,user){
    if(err){
      return callback(err);
    }
    if(!user){
      return callback({message:'User not found.',status:401},null);
    }
    bcrypt.compare(password,user.password,function(err,result){
      if(result===true){
        return callback(null,user);
      }else{
        return callback({message:'Wrong Username/password combination.',status:401},null);
      }
    });
  })
}
var User = mongoose.model('User',userSchema);

module.exports = User;
