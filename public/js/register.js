!function(){
  (function() {
  setTimeout(function(arg1) {
    if (arg1 === 'test') {
      // feature test is passed, no need for polyfill
      return;
    }
    var __nativeST__ = window.setTimeout;
    window.setTimeout = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
      var aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeST__(vCallback instanceof Function ? function() {
        vCallback.apply(null, aArgs);
      } : vCallback, nDelay);
    };
  }, 0, 'test');

    var interval = setInterval(function(arg1) {
    clearInterval(interval);
    if (arg1 === 'test') {
      // feature test is passed, no need for polyfill
      return;
    }
    var __nativeSI__ = window.setInterval;
    window.setInterval = function(vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */ ) {
      var aArgs = Array.prototype.slice.call(arguments, 2);
      return __nativeSI__(vCallback instanceof Function ? function() {
        vCallback.apply(null, aArgs);
      } : vCallback, nDelay);
    };
  }, 0, 'test');
  }())

  var registerForm = document.getElementById('register-form');
  var exampleGoals=['I want to be more social',
                    'I want to get fit',
                    'I want to save money for a trip',
                    'I want to improve my grades',
                    'I want to begin a new language',
                    'I want to finish that paper',
                    'I want to learn something new',
                    'I want to finish House of Cards',
                    'I want to finish that book',
                    'I want to be a better me',
                    'I want to stop smoking',
                    'I want to make a new friend'
                  ];
  //change formChoice
  function changeFormChoice(){
    var registerForm = $('#register-form');
    $('#form-choice li').on('click',function(){
      $(this).siblings().removeClass('selected');
      $(this).addClass('selected');
    });
    var emailErrorClone = $('<div>',{
      class:'error',
      id:'email-error'
    });
    var useremailLabelClone = $('<label>',{
      for:'useremail',
      id:'useremail-label',
      text:'Email'
    });
    var useremailClone = $('<input>',{
      id:'useremail',
      placeholder:'Enter your email',
      type:'input',
      name:'useremail'
    });
    var pwdConfirmErrorClone = $('<div>',{
      class:'error',
      id:'password-confirm-error'
    });
    var pwdConfirmLabelClone = $('<label>',{
      for:'password-confirm',
      id:'password-confirm-label',
      text:'Confirm Password'
    });
    var pwdConfirmClone = $('<input>',{
      id:'password-confirm',
      placeholder:'Confirm Password',
      type:'password',
      name:'passwordconfirmation'
    });

    $('#sign-in-choice').on('click',function(){
      registerForm.attr('action','/signIn');
      $('#register').text('Sign In');
      document.getElementById('register').className = 'sign-in';
      if($('#useremail').length > 0 && $('#password-confirm').length > 0){
        $('#email-error').remove();
        $('#useremail-label').remove();
        $('#useremail').remove();
        $('#password-confirm-error').remove()
        $('#password-confirm-label').remove();
        $('#password-confirm').remove();
        $('#password').attr('placeholder','Enter your password');
      }
    });

    $('#sign-up-choice').on('click',function(){
      registerForm.attr('action','/signUp');
      $('#register').text('Sign Up');
      document.getElementById('register').className = 'sign-up';
      if($('#useremail').length === 0 && $('#password-confirm').length === 0){
        emailErrorClone.insertAfter('#username');
        useremailLabelClone.insertAfter(emailErrorClone);
        useremailClone.insertAfter(useremailLabelClone);
        pwdConfirmErrorClone.insertAfter('#password');
        pwdConfirmLabelClone.insertAfter(pwdConfirmErrorClone);
        pwdConfirmClone.insertAfter(pwdConfirmLabelClone);
        $('#password').attr('placeholder','Enter a password min(5 chars)');

      }
    });

  }
  changeFormChoice();

  function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
  }

  var cursorInterval = setInterval(function(){
    cursorAnimation();
  },500);

  function type(phrase){
    function insertLetter(letter){
      var el = $('<span>',{
        class:'letter',
        text: letter
      });
      el.insertBefore('#cursor');
    }
    for(var x = 0; x < phrase.length;x++){
      setTimeout(insertLetter,100*x,phrase[x]);
    }
  }
  randNum = Math.floor(Math.random() * exampleGoals.length) + 0;
  setTimeout(type(exampleGoals[randNum]),5000);

  //validation


  var checkUsername = function(){
    var userRe = /^[\w-_]{5,20}$/;
    $('#all-error').text('');
    var username = $('#username');
    if(username.val().length < 5){
      $('#username-error').text('Username must be at least 5 chars long.');
      return false;
    }else if(username.val().length > 20){
      $('#username-error').text('Username can be up to 20 chars long.');
    }else if(!userRe.test(username.val())){
      $('#username-error').text('Username must be alphanumeric with no spaces hyphens and underscores are allowed.');
    }else{
      $('#username-error').text('');
      return true;
    }
  }

  var checkEmail = function(){
    $('#all-error').text('');
    var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email= $('#useremail');
    if(!emailRe.test(email.val())){
      $('#email-error').text('Email is not valid.');
      return false;
    }else{
      $('#email-error').text('');
      return true;
    }
  }
  var checkPassword = function(){
    $('#all-error').text('');
    var password = $('#password');
    $('#all-error').text('');
    if(password.val().length < 5){
      $('#password-error').text('Password must be at least 5 chars long.');
      return false;
    }else{
      $('#password-error').text('');
      return true;
    }
  }
  var checkPwdConfirm = function(){
    $('#all-error').text('');
    var password = $('#password');
    var passwordConfirmation = $('#password-confirm');

    if(passwordConfirmation.val() !== password.val()){
      $('#password-confirm-error').text('Passwords do not match');
      return false;
    }else{
      $('#password-confirm-error').text('');
      return true;
    }
  }
  var validateSignUp = function(){
    if(checkUsername && checkEmail && checkPassword && checkPwdConfirm){
      return true;
    }
    return false;
  }

  var validateSignIn = function(){
    if(checkUsername && checkPassword){
      return true;
    }
    return false;
  }
  $(registerForm).on('blur','#username',checkUsername);
  $(registerForm).on('blur','#useremail',checkEmail);
  $(registerForm).on('blur','#password',checkPassword);
  $(registerForm).on('blur','#password-confirm',checkPwdConfirm);

  $(registerForm).on('click','.sign-up',function(e){
    e.preventDefault();
    var validUsername = checkUsername();
    var validEmail = checkEmail();
    var validPass = checkPassword();
    var validConfirm = checkPwdConfirm()
    if(validUsername && validEmail && validPass && validConfirm){
      //$(registerForm).submit();
      $.ajax({
        url:'/signUp',
        dataType:'json',
        method:'POST',
        data:{
          username:$('#username').val(),
          useremail:$('#useremail').val(),
          password:$('#password').val(),
          passwordconfirmation:$('#password-confirm').val(),
          favoriteFood:$('#favoriteFood').val()
        },
        success:function(data,status,jqXHR){
          window.location.href= data.redirect;
          return false;
        },
        error:function(jqXHR,status,error){
          var errorResponse= JSON.parse(jqXHR.responseText);
          if(errorResponse.all){
            $('#all-error').text(errorResponse.all)
          }
          if(errorResponse.username){
            $('#username-error').text(errorResponse.username);
          }
          if(errorResponse.email){
            $('#email-error').text(errorResponse.email);
          }

          if(errorResponse.password){
            $('#password-error').text(errorResponse.password);
          }
          return false;
        }
      });
    }
  });

  $(registerForm).on('click','.sign-in',function(e){
    e.preventDefault();
    var validUsername = checkUsername();
    var validPass = checkPassword();
    if(validUsername && validPass){
    $.ajax({
      url:'/signIn',
      method:'POST',
      dataType:'json',
      data:{
        username:$('#username').val(),
        password:$('#password').val(),
        favoriteFood:$('#favoriteFood').val()
      },
      success:function(data,status,jqXHR){
        window.location.href= data.redirect;
        return false;
      },
      error:function(jqXHR,status,error){
        console.log(jqXHR);
        var errorResponse= JSON.parse(jqXHR.responseText);
        $('#all-error').text(errorResponse);
        return false;
      }
    })

    }
  });
}();
