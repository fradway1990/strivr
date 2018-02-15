!function(){
  var smallNav = document.querySelector('.small-nav');
  var smallNavOffset = $(smallNav).offset().top;
  var generateMessage = message.generateMessage;
  $(window).on('resize',function(){
    smallNavOffset = $(smallNav).offset().top;
  });
  $(window).on('scroll',function(){
    var navHeight = $('.navbar-header').height();
    if($(window).innerWidth() < 768){
      if(window.pageYOffset > smallNavOffset){
        $(smallNav).addClass('fixed');
        $(smallNav).css({top:navHeight})
      }else{
        $(smallNav).removeClass('fixed');
      }
    }else{
      $(smallNav).removeClass('fixed');
    }
  });
  function completeGoal(goalId,callback){
    $.ajax({
      type:'PUT',
      url: '/api/goals/'+ userId+'/'+goalId,
      dataType: 'json',
      data:{},
      success:function(data,status,jqXHR){
        console.log(data);
        callback('success');
      },
      error:function(jqXHR,status,err){
        console.log(jqXHR);
        callback('failure');
      }
    });
  }
  function createGoalBox(goals,isFor){
    var goalRow = $('<div></div>',{
      'class':'row'
    }).appendTo('#content-area');

    for(var x = 0; x < goals.length;x++){
      var goal = goals[x];
      var goalCol = $('<div></div>',{
        'class':'col-xs-12 col-md-6'
      }).appendTo(goalRow);
      var goalInfo = $('<div></div>',{
        'class': 'current-goal',
        'html':"<h4>"+goal.goalName+"</h4>"
      }).appendTo(goalCol);
      var todoList = $('<div></div>',{
        'class':'todo-list'
      }).appendTo(goalInfo);
      //create Todo list
      if(isFor === 'current'){
        var taskStatement = "<h5>Tasks for Today</h5>";
      }

      if(isFor === 'upcoming'){
        var taskStatement = "<h5>Upcoming Tasks</h5>";
      }

      if(isFor === "completed"){
        var taskStatement = "<h5>Completed Tasks</h5>";
      }

      if(isFor === "incomplete"){
        var taskStatement = "<h5>Incomplete Tasks</h5>";
      }

      var todoTitle = $("<div></div>",{
        class:'todo-title',
        html: taskStatement
      }).appendTo(todoList);

      for(var y = 0; y < goal.tasks.length;y++){
        var todo = $('<div></div>',{
          'class':'todo',

        }).appendTo(todoList);

        if(isFor !== 'upcoming' && isFor !== 'completed'){
          var checkbox = $('<div></div>',{
            'class':'checkbox',
            'data-taskId':goal.tasks[y]._id
          }).appendTo(todo);
        }

        var todoText = $('<span></span>',{
          text:goal.tasks[y].taskText
        }).appendTo(todo);

        if(isFor !== 'current'){
          var date = $('<div></div>',{
            'class':'due-date',
            text:'Due By: '+ moment(goal.tasks[y].date).format('MMMM DD YYYY')
          }).appendTo(todo);

        }
      }

      if($(todoList).children('.todo').length === 0){
        $('<div></div>',{
          'class':'empty-goal',
          'text':'No Tasks To Show'
        }).appendTo(todoList);
      }

    }
  }

  function getGoals(isFor){
    $('#content-area').html('');
    var complete = 'null';
    if(typeof isFor === 'undefined'){
      var isFor = 'current';
    }
    if(isFor === 'current'){
      var earliest = moment().utc().startOf('day').toISOString();
      var latest = moment().utc().endOf('day').toISOString();
      complete = 'false';
    }else if(isFor === 'upcoming'){
      var earliest = moment().utc().startOf('day').add(1, 'days').toISOString();
      var latest = moment().utc().endOf('day').add(10, 'days').toISOString();
      complete = 'false';
    }else if(isFor === 'completed'){
      var earliest = moment().utc().startOf('day').subtract(1000, 'years').toISOString();
      var latest = moment().utc().endOf('day').add(1000, 'years').toISOString();
      complete = 'true';
    }else if(isFor === 'incomplete'){
      var earliest = moment().utc().startOf('day').subtract(1000, 'years').toISOString();
      var latest = moment().utc().endOf('day').toISOString();
      complete = 'false';
    }

    $.ajax({
      type:'GET',
      url: '/api/goals/'+ userId+'?'+'earliest='+earliest+'&latest='+latest+'&completed='+complete,
      dataType: 'json',
      data:{},
      success:function(data,status,jqXHR){
        console.log(data);
        createGoalBox(data,isFor);
      },
      error:function(jqXHR,status,err){
        console.log(jqXHR);
        generateMessage('Could not get goals.','error');
      }
    });
  }

  $('.profile-nav').on('click',function(){
    $('.profile-nav').removeClass('selected');
    $(this).addClass('selected');
    if($(this).hasClass('current-goals')){
      $('.current-goals').addClass('selected');
      getGoals('current');
    }
    if($(this).hasClass('goal-upcoming')){
      $('.goal-upcoming').addClass('selected');
      getGoals('upcoming');
    }
    if($(this).hasClass('goal-complete')){
      $('.goal-complete').addClass('selected');
      getGoals('completed');
    }
    if($(this).hasClass('goal-incomplete')){
      $('.goal-incomplete').addClass('selected');
      getGoals('incomplete');
    }
  });

  $('#content-area').on('click','.checkbox',function(){
      var taskId = $(this).attr('data-taskId');
      if($(this).not().has('fa-check')){
        var _this = $(this);
        completeGoal(taskId,function(status){
          if(status ==='success'){
            var check = $('<span class="fa fa-check"></span>').appendTo(_this);
            setTimeout(function(){
              _this.parent().fadeOut(100,function(){
                $(this).remove();
                if($(this).children('.todo').length === 0){
                  $('<div></div>',{
                    'class':'empty-goal',
                    'text':'No Tasks To Show'
                  }).appendTo($(this).parent());
                }
              })
            },200);
          }
          if(status === 'failure'){
            //handle error
            console.log('failed');
          }
        });
      }
  });

}();
