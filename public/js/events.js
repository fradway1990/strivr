var eventModule = (function(){
  var generateAlert = message.generateAlert;
  var generateMessage = message.generateMessage;
  var currentDay = moment().set({hour:0,minute:0,second:0,millisecond:0});
  var offset = currentDay.utcOffset();
  currentDay = moment.utc(currentDay).set({minute:offset});
  var Events = eventsObject.Events;

  if(typeof goal === 'undefined'){
    var goal = {"goalName":'',"events":[]};
  }else{
    for(var x = 0; x < goal.events.length;x++){
      goal.events[x].id = x;
      Events.eventId++;
      goal.events[x].date = Events.daysToDates(goal.startDate,goal.events[x].date);
      Events.events.push(goal.events[x]);
    }

  }

  var goalInput = $('.goal-name');
  function bindCalendarEvents(){
    goalInput.val( goal.goalName);
    var viewDateISO = Events.currentViewDateISO;
    var validDays = $('.valid');
    changeTodoLis(viewDateISO);
    assignColors();
    validDays.on('click',function(){
      //get current date from calendar id
      var date = $(this).attr('id');
      //update view dates and save it to a variable
      Events.updateViewDate(date);
      viewDateISO = Events.currentViewDateISO;

      //change text in the view to reflect new date
      var monthYear = document.querySelector('.month-year');
      var bigDay = document.querySelector('.big-day');
      monthYear.innerText = Events.viewMonth +', '+Events.viewYear;
      bigDay.innerText = Events.viewDate;
      //show event container
      var eventContainer = spawnEventContainer(viewDateISO);
      $('#planner').prepend(eventContainer);
      changeTodoLis(viewDateISO);
    });


    function spawnEventContainer(date){
      ////console.log('spawnEventContainer');
      //generate event container
      var editEventContainer = $('<div>',{
        class:'event-containment-row'
      });
      var eventContainer = $('<div>',{
        id:'event-container'
      }).appendTo(editEventContainer);
      var h2 = $('<h2>',{
        text:'Today\'s Events'
      }).appendTo(eventContainer);

      var buttonContainer = $('<div>',{
        class:'button-container'
      }).appendTo(eventContainer);

      var addEvent = $('<button>',{
        type:'button',
        html:'<i class="fa fa-plus-circle" aria-hidden="true"></i> <span class="button-text">Add Event</span>'
      }).appendTo(buttonContainer);

      var close = $('<button>',{
        type:'button',
        html:'<i class="fa fa-times-circle" aria-hidden="true"></i> <span class="button-text">Close</span>'
      }).appendTo(buttonContainer);
      //end generate
      if(moment(date).isBefore(currentDay)){
        addEvent.children('i').css({'color':'#cecece'});
        addEvent.children('.button-text').css({'color':'#cecece'});
      }
      //generate todo list based on date argument
      var toDoList = spawnTodo(date).appendTo(eventContainer);

      //button events
      close.on('click',function(){
        editEventContainer.remove();
        assignColors();
      });
      addEvent.on('click',function(){
        if(!moment(date).isBefore(currentDay)){
          eventContainer.children().hide();
          spawnEditEventContainer(date).prependTo(eventContainer);
        }
      });
      return editEventContainer;
    }


    function spawnTodo(){
      //console.log('spawnToDo');
      var dateEvents = Events.searchEventsByDate(viewDateISO);
      //if no events are found return an empty unordered list
      if(dateEvents.length === 0){
        return $('<ul>',{
          class:'todo-list'
        });
      }

      //create a ul
      var ul = $('<ul>',{
        class:'todo-list'
      });
      //for every returned event create a list item
      for(var x = 0;x < dateEvents.length;x++){
        spawnTodoLi(dateEvents[x]).appendTo(ul);
      }
      return ul;
    }

    //takes a single event as an argument and generates a list item
    function spawnTodoLi(dateEvent){
      var eventContainer = document.getElementById('event-container');

      //generate list item
      var li = $('<li>',{
        text: dateEvent.eventText,
        class:dateEvent.id+'_todo'
      });
      var innerUl = $('<ul>').appendTo(li);
      if(!(moment(dateEvent.date[0]).isBefore(currentDay) && dateEvent.eventType === 'singleDay')){
        var edit = $('<li>',{
          text:'Edit'
        }).appendTo(innerUl);
        var del = $('<li>',{
          text:'Delete'
        }).appendTo(innerUl);
      }
      //change border color based on the list item argument
      if(dateEvent.eventType === "multiDay"){
        li.css({'border-left-color':'#F59D2A'});
      }else{
        li.css({'border-left-color':'#2c3d4f'});
      }
      //end generate

      //button events
      if(typeof edit !== 'undefined' && typeof del !== 'undefined'){
        edit.on('click',function(){
          //get the list items corresponding eventid by parsing the class
          //var liId = $(this).parent().parent().attr('class').split('_');
          //hide background calendar before creating eventEdit container
          if($('#event-container').length === 0){
            var eventContainer = spawnEventContainer(viewDateISO);
            console.log()
            $('#planner').prepend(eventContainer);
          }
          $('#event-container').children().hide();

          //if an edit container is already present delete it too
          var editEvent = document.querySelector('.edit-event');
          if(editEvent){
            $(editEvent).remove();
          }
          //create ane edit event container
          spawnEditEventContainer(dateEvent.id).prependTo('#event-container');
        });


        del.on('click',function(){
          //get id of events array object
          var _this = this;
          //if deleting a multiday event show an alert dialog first
          if(dateEvent.eventType === "multiDay"){
            var message = 'You are about to delete a multiday event. '+
            'This will cause several events to be deleted. Do you want this?';
            generateAlert(message,deleteItem);
          }else{
            deleteItem();
          }

          function deleteItem(){
            var todoClass =  $(_this).parent().parent().attr('class');
            var liId = todoClass.split('_');
            var eventId = liId[0];
            Events.removeEvent(eventId);
            //remove top level parent li
            $('.'+todoClass).remove();
            var editContainer = $('.'+eventId+'_edit');
            changeTodoLis(viewDateISO);
            if(editContainer.length > 0){
              $(editContainer).remove();
              $('#event-container').children().show();
            }
            assignColors();
          }

        });
      }

      //end button events
      return li;
    }


    function changeTodoLis(){
      //console.log('changeTodoLis');
      $('.todo-list').html('');
      var evts = Events.searchEventsByDate(viewDateISO);
      for(var x = 0; x < evts.length;x++){
        var li= spawnTodoLi(evts[x]);
        $('.todo-list').prepend(li);
      }
    }


    function spawnEditEventContainer(id){
      //console.log('spawnEditEventContainer');
      var message = "Edit event for "+Events.currentViewDateString;
      var eventText = '';
      var eventLength = 1;
      if(typeof id !== 'undefined'){
        var evt = Events.searchEvent(id);
        //get event text of event
        if(typeof evt !== 'undefined'){
          eventText = evt.eventText;
          eventLength = evt.eventLength;
          if(eventLength > 1){
            message = "Edit multi-day event."
          }
        }
      }
      //begin generating eventEditContainer
      var editEvent = $('<div>',{
        class:'edit-event '+id+'_edit',
        text:message
      });
      var textarea = $('<textarea>',{
        text:eventText
      }).appendTo(editEvent);

      var label = $('<label>',{
        'for':'event-length',
        'text':'Event Length'
      }).appendTo(editEvent);

      var select = $('<select>',{
        name:'event-length',
        id:'event-length'
      }).appendTo(editEvent);

      //limit selection based on days left
      var start = moment(viewDateISO);
      var end = moment(Events.endDateISO);
      var daysTillEnd= end.diff(start,'days');
      //console.log(daysTillEnd);
      for(var x = 1; x <= daysTillEnd + 1; x++){
        var days = (x === 1)? 'day' : 'days';
        var option = $('<option>',{
          value:x,
          text:x+' '+days
        }).appendTo(select);
        if(x === eventLength){
          option.attr('selected','selected');
        }
      }
      var buttonContainer = $('<div>',{
        class:'button-container'
      }).appendTo(editEvent);
      var confirmEvent = $('<button>',{
        type:'button',
        html:'<i class="fa fa-check-circle" aria-hidden="true"></i> <span class="button-text">Confirm</span>'
      }).appendTo(buttonContainer);

      var close = $('<button>',{
        type:'button',
        html:'<i class="fa fa-times-circle" aria-hidden="true"></i> <span class="button-text">Close</span>'
      }).appendTo(buttonContainer);
      //end generate

      //code for confirm button click
      confirmEvent.on('click',function(){
        var eventLength = parseInt(document.getElementById('event-length').value);
        var eventText = textarea.val().trim();
        if(eventText !== ''){
          //if event was found update event
          //else create a new event
          if(typeof evt !== 'undefined'){
            var updatedEvent = Events.updateEvent(id,{"eventText":eventText,"length":eventLength});
            changeTodoLis(viewDateISO);
          }else{
            var newEvent = Events.createEvent(viewDateISO,eventText,eventLength);
            changeTodoLis(viewDateISO);
          }
          editEvent.remove();
          $('#event-container').children().show();
        }else{
          generateMessage('Please enter event text before saving.','error');
          textarea.css({'border-color':'red'});
        }

      });
      close.on('click',function(){
        editEvent.remove();
        $('#event-container').children().show();
      });
      return editEvent;
    }


    function assignColors(){
      for(var x = 0;x < validDays.length;x++){
        var validDay = validDays[x];
        var validDayId = $(validDay).attr('id');
        var evts = Events.searchEventsByDate(validDayId);
        if(evts.length > 0){
          //search for single events
          var singleEvents = [];
          for(var i = 0; i < evts.length;i++){
            if(evts[i].eventType === "singleDay"){
              singleEvents.push(evts[i]);
              break;
            }
          }
          if(singleEvents.length > 0 && !moment.utc(validDayId).isBefore(currentDay)){
            $(validDay).children('.day-fill').css({
              'background-color': '#2c3d4f',
              'color':'white'
            });
          }else if(singleEvents.length > 0 && moment.utc(validDayId).isBefore(currentDay)){
            $(validDay).children('.day-fill').css({
              'background-color': '#cecece',
              'color':'white'
            });
          }else if(singleEvents.length === 0 && moment.utc(validDayId).isBefore(currentDay)){
            $(validDay).children('.day-fill').css({
              'background-color': 'white',
              'color':'gray'
            });
          }else{
            $(validDay).children('.day-fill').css({
              'background-color': 'white',
              'color':'#333'
            });
          }
          var multiEvents = [];
          //search for multiday events
          for(var i = 0; i < evts.length;i++){
            if(evts[i].eventType === "multiDay"){
              multiEvents.push(evts[i]);
              break;
            }
          }
          if(multiEvents.length > 0 && !moment.utc(validDayId).isBefore(currentDay)){
            $(validDay).css({
              'border-bottom': '0.3rem solid #F59D2A',
            });
          }else if(multiEvents.length > 0 && moment.utc(validDayId).isBefore(currentDay)){
            $(validDay).css({
              'border-bottom': '0.3rem solid #cecece',
            });
          }else{
            $(validDay).css({
              'border-bottom':'none'
            });
          }
        }else{
          $(validDay).css({
            'border-bottom':'none'
          });

          $(validDay).children('.day-fill').css({
            'background-color': 'white',
            'color':'#333'
          });
        }
      }
    }

  }
  return {
    goal:goal,
    Events:Events,
    bindCalendarEvents:bindCalendarEvents,
    goalInput:goalInput
  }

})();
