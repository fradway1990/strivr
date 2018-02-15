var calendar = (function(year,month,day){
  var saveAttempted = false;
  var slideJS = SlideJS;
  var goalJS = GoalJS;
  var Goal = new goalJS.Goal();
  //get todays day info and place it on page
  var month = moment().month();
  var day = moment().date();
  var year = moment().year();
  var todaysMonthText = moment().format('MMMM');
  var todaysYearText = moment().format('YYYY');
  var todaysDayText = moment().format('D');
  $('.month-year').html(todaysMonthText+' '+todaysYearText);
  $('.big-day').html(todaysDayText);

  function addNewMonth(){
    if(month === 11){
      year += 1;
      month = 0;
    }else{
      month+=1;
    }
    return {year: year, month: month,day: 1}

  }

  var CalendarSlider = new slideJS.Slider($('#calendar-container'));
  //add currentCalendarMonth


  addCalendar(year,month,day,addArrows);



  //get this month's calendar
  function addCalendar(year,month,day,callback){
    $.ajax({
      type:'POST',
      url:'/sendCalendar',
      data:{
        year:year,
        month:month,
        day:day

      },
      success:function(data){
        CalendarSlider.addStep(data.html);
        callback();
      },
      error:function(jqXHR,status,err){
        console.log(jqXHR);
      }
    });
  }

  function addArrows(){
    var rightArrow = $('<span></span>',{
      "class":'right-arrow forward',
      "html":'&#10095;'
    });
    var leftArrow = $('<span></span>',{
      "class":'left-arrow back',
      "html":'&#10094;'
    });


    $('#calendar-container').on('click','.valid',function(){
      var date = $(this).attr('id');
      addTasksContainer(date);
    });

    if(CalendarSlider.steps > 1){
      $('#'+CalendarSlider.sliderId+' .month-scroll').last().prepend(leftArrow);

      leftArrow.on('click',function(){
        CalendarSlider.back(1);
      });
    }
    $('#'+CalendarSlider.sliderId+' .month-scroll').last().append(rightArrow);
    rightArrow.on('click',function(){
      if(CalendarSlider.currentStep === CalendarSlider.steps){
        var newMonth = addNewMonth();
        addCalendar(newMonth.year,newMonth.month,newMonth.day,addArrows);
        CalendarSlider.forward(1);
      }else{
        CalendarSlider.forward(1);
      }
    });
  }

  function addTasksContainer(date){

    function removeTasksContainer(){
      $('.event-containment-row').remove();
    }

    var eventContainmentRow = $('<div></div>',{
      'class':'event-containment-row'
    }).appendTo('#right-side');

    var eventContainer = $('<div></div>',{
      'class':'event-container'
    }).appendTo(eventContainmentRow);

    var taskNav = $('<div></div>',{
      class:'button-container'
    }).appendTo(eventContainer);
    var taskContainer = $("<ul></ul>",{
      'class':'task-display'
    }).appendTo(eventContainer);;

    var html = '<div style="text-align:center; font-weight:bold; font-size:1.3rem; margin-bottom:1rem;">Tasks for '+ moment(date).format("MMMM D YYYY")+'</div><button type="button" data-for="'+date+'"class="add-task"><i class="fa fa-plus-circle"></i> <span class="button-text">Add Task</span></button>';
    html+= '<button type="button" class="close-task-menu"><i class="fa fa-times-circle"></i> <span class="button-text">Close</span></button>';
    taskNav.html(html);
    displayTasks(date);
    $(eventContainer).on('click','.close-task-menu',function(){
      removeTasksContainer();
      fillCalendarColors(Goal)
    });
    $(eventContainer).on('click','.add-task',function(){
      addTheTask(date);
    });
  }

  function addTheTask(date,obj){
    if(typeof obj === 'undefined'){
      var obj = {
        edit: false,
        id: -1
      }
    }else{
      var obj = {
        edit:obj.edit,
        id: obj.id
      }
    }
    function removeTasksContainer(){
      $('.task-containment-row').remove();
    }
    if(obj.edit){
      var task = Goal.getTaskById(obj.id);
      if(!task){
        obj.edit = false;
      }
    }

    if(obj.edit){
      var taskContaimentDivObj = {
        'class':'task-containment-row',
        'data-id':obj.id
      }
    }else{
      var taskContaimentDivObj = {
        'class':'task-containment-row',
      }
    }
    var taskContainmentRow = $('<div></div>',taskContaimentDivObj).appendTo('#right-side');

    var taskContainer = $('<div></div>',{
      'class':'task-container'
    }).appendTo(taskContainmentRow);

    var taskNav = $('<div></div>',{
      class:'button-container'
    }).appendTo(taskContainer);
    var taskError = $('<div></div>',{
      class:'error'
    }).appendTo(taskContainer);
    var taskTextDiv = $('<div></div>',{
      class:'edit-event'
    }).appendTo(taskContainer);


    var textareatext = '';
    if(obj.edit){
      textareatext = task.taskText;
    }
    var taskText = $('<textarea id="task-text" placeholder="'+ 'Add a task for '+ moment(date).format("MMMM D YYYY") +'">'+textareatext+'</textarea>').appendTo(taskTextDiv);

    var html = '<button type="button" data-for="'+date+'"class="add-task"><i class="fa fa-plus-circle"></i> <span class="button-text">Confirm</span></button>';
    html+= '<button type="button" class="close-task-menu"><i class="fa fa-times-circle"></i> <span class="button-text">Cancel</span></button>';

    taskNav.html(html);
    $(taskContainer).on('click','.close-task-menu',removeTasksContainer);


    $(taskContainer).on('click','.add-task',function(){
      if(obj.edit){
        var taskText = document.getElementById('task-text').value;
        var task = Goal.editTask(obj.id,taskText);
        if(!task){
          document.getElementsByClassName('error')[0].innerHTML = "There was an issue editing your task."
        }else if(task === 'error'){
          document.getElementsByClassName('error')[0].innerHTML = "Please enter a task below."
        }else{
          document.getElementsByClassName('error')[0].innerHTML = "";
          removeTasksContainer();
          displayTasks(date);
        }
      }else{
        var taskText = document.getElementById('task-text').value;

        var task =Goal.createSingleTask({
          taskText: taskText,
          date:date
        });
        //check if task passed validation
        if(!task){
          document.getElementsByClassName('error')[0].innerHTML = "Please enter a task below.";
        }else{
          document.getElementsByClassName('error')[0].innerHTML = "";
          removeTasksContainer();
          displayTasks(date);
        }
      }

    });

  }

  //display task on event container menu
  function displayTasks(date){
    $('.task-display').html('');
    var tasks = Goal.getTasksByDate(date);
    for(var x = 0; x < tasks.length; x++){
      console.log(tasks[x]);
      var task = $('<li></li>',{
        html: '<p>'+tasks[x].taskText+'</p><ul class="task-options"><li class="edit-task">Edit</li><li class="delete-task">Delete</li></ul>',
        'data-id':tasks[x].id
      }).appendTo('.task-display');
      task.on('click','.edit-task',function(){
        var _this = $(this).parent().parent();
        addTheTask(date,{
          edit:true,
          id: parseInt($(_this).attr('data-id'))
        });

      });

      task.on('click','.delete-task',function(){
        var _this = $(this).parent().parent();
        console.log($(_this).attr('data-id'));
        Goal.deleteTask(parseInt($(_this).attr('data-id')));
        task.remove();
      });
    }
  }

  function fillCalendarColors(goal){
    $('.day-fill').css({'background-color':'#FFF'});
    $('.valid .day-fill').css({'color':'#333'});
    for(var x = 0; x < goal.tasks.length; x++){
      if(document.getElementById(goal.tasks[x].date)){
        var el = document.getElementById(goal.tasks[x].date);
        el.children[0].style.backgroundColor="#45c1ef";
        el.children[0].style.color="#FFF";
      }
    }
  }

  $('#submit-goal').on('click',function(){
    if(!saveAttempted){
      saveAttempted = true;
      var isValid = Goal.validateGoal();
      if(isValid.valid === true){
        goalObj = {
          "goalName":Goal.goalName,
          "tasks":Goal.tasks
        };
        $.ajax({
          type:'POST',
          url:'/goal',
          dataType : "json",
          contentType: 'application/json',
          data: JSON.stringify(goalObj),
          success:function(data){
            //do success stuff
            window.location.href='/user';
          },
          error:function(jqXHR,status,err){
            //do error stuff
            flash('error',jqXHR.responseText);
            saveAttempted = false;
          }
        });
      }else{
        //show error message
        flash('error',isValid.message);
        saveAttempted = false;
      }


    }
  });


  function flash(status,message){
    var message = message;
    var cls = 'f-success';
    if(status === 'error'){
      cls="f-failure";
    }

    var flash = $('<div></div>',{
      'id':'flash',
      'class':'f-error',
      text:message
    });
    $('body').prepend(flash);
    var timeout = setTimeout(function(){
      flash.fadeOut(200,function(){
        $(this).remove();
      });

    },2000);
  }
  $('.goal-name').on('blur',function(){
    Goal.goalName = this.value;
  });
})();
