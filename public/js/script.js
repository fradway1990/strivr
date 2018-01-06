!function(){
  var goal = eventModule.goal;
  var Events = eventModule.Events;
  var bindCalendarEvents = eventModule.bindCalendarEvents;
  var generateMessage = message.generateMessage;
  var goalInput = eventModule.goalInput;
  getCalendar();
  addSlimScroll();


  function getCalendar(){
    var startDate;
    if(typeof goal.startDate !== 'undefined'){
      startDate = moment(goal.startDate).set({hour:0,minute:0,second:0,millisecond:0});
      var offset = startDate.utcOffset();

    }else{
      startDate = moment().set({hour:0,minute:0,second:0,millisecond:0});
      var offset = startDate.utcOffset();
    }

    Events.startDate = moment.utc(startDate).set({minute:offset}).toISOString();
    Events.resetStartDate(Events.startDate);
    $.ajax({
      url:'/sendCalendar',
      data: {
              "startDate":new Date(startDate).toISOString()
            },
      dataType: 'json',
      success: function(data,status,jqXHR){
        var calendarMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
        var currentDay = new Date(data.currentDay);
        var month = calendarMonths[currentDay.getMonth()];
        var day = currentDay.getDate();
        var year = currentDay.getFullYear();
        var monthYear = document.querySelector('.month-year');
        var bigDay = document.querySelector('.big-day');
        monthYear.innerText = month +', '+year;
        bigDay.innerText = day;
        var calendarWrapper = document.getElementById('calendar-wrapper');
        calendarWrapper.innerHTML = data.html;
        addSlider();
        bindCalendarEvents();
      },
      error: function(jqXHR,status,err){
        generateMessage(jqXHR.responseJSON.message,'error');
      },
      type:'POST'
    });
  }


  var resizeTimer;
  (function(){
    $(window).on('resize',function(e){
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        addSlimScroll();
      },20);
    });
  })();


  function addSlimScroll(){
    var todoList = document.querySelector('.daily-goals .todo-list');
    if(todoList.offsetHeight > 250){
      $(todoList).slimScroll({
        height: '15.625rem'
      });
      var blueFade = document.createElement('div');
      blueFade.classList.add('blue-fade');
      var slimScroll = document.querySelector('.slimScrollDiv');;
      slimScroll.appendChild(blueFade);
    }
  }

  function addSlider(){
    var calendarContainer = document.getElementById('calendar-container');
    var slider = new Slider(calendarContainer);
    var prevButtons = calendarContainer.getElementsByClassName('left-arrow');
    var nextButtons = calendarContainer.getElementsByClassName('right-arrow');
    for(var x = 0; x < prevButtons.length;x++){
      prevButtons[x].addEventListener('click',function(){
      slider.switchStep('back');
    });
    }

  for(var x = 0; x < nextButtons.length;x++){
    nextButtons[x].addEventListener('click',function(){
        slider.switchStep('fwd');
      })
    }
  }



  $('#submit-goal').on('click',function(){
    validateGoal(goal,function(){
      console.log(goal);
      $.ajax({
        url:'/goal',
        data:goal,
        dataType:'json',
        type:'POST',
        success:function(data,status, jqXHR){
          console.log(data);
        },
        error:function(jqXHR,status,err){
          console.log(jqXHR);
          generateMessage(jqXHR.responseJSON.message,'error');
        },
        type:'POST'
      });
    });
  });
  $('#update-goal').on('click',function(){
    validateGoal(goal,function(){
      console.log(goal);
      $.ajax({
        url: '/api/goal/'+goal._id,
        type:'PUT',
        data:goal,
        dataType:'json',
        success:function(data,status,jqXHR){
          generateMessage(data.message,'ok');
        },
        error:function(jqXHR,status,err){
          generateMessage(jqXHR.responseJSON.message,'error');
        }
      });
    });
  });
  $('#restart-goal').on('click',function(){
    $.ajax({
      url:'/api/goal/'+goal._id+'/restart',
      type:'PUT',
      dataType:'json',
      data:{"startDate":moment.utc().toISOString()},
      success:function(data,status,jqXHR){
        generateMessage(data.message,'ok');
        window.location.reload()
      },
      error:function(jqXHR,status,err){
        generateMessage(jqXHR.responseJSON.message,'error');
      }
    });
  });
  function validateGoal(goal,callback){
    if(goalInput.val().trim() ===''){
      generateMessage('Please give your goal a name.','error');
    }else if(Events.events.length < 1){
      generateMessage('Please add an event to your goal.','error');
    }else{
      goal.goalName = goalInput.val().trim();
      goal.events = JSON.stringify(Events.events);
      callback();
    }
  }
  $('#goal-settings').on('click',function(){
    $('#goal-settings-dropdown').slideToggle(100);
  });

}();
