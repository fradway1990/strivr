var eventsObject = (function(){
  function Events(){
    var dayLimit = 90;
    this.startDate = moment().set({hour:0,minute:0,second:0,millisecond:0});
    var offset = this.startDate.utcOffset();
    this.startDateISO = moment.utc(this.startDate).set({minute:offset}).toISOString();
    this.currentDateISO = this.startDate.toString();
    this.currentViewDate = this.startDate;
    this.currentViewDateISO = this.startDateISO;
    this.currentViewDateString = moment(this.startDate).format('ddd, MMM Do YYYY');
    this.endDate = moment(this.startDate).add(dayLimit - 1, 'd');
    this.endDateISO = moment.utc(this.endDate).set({minute:offset}).toISOString();
    this.events = [];
    this.eventId = 0;
    this.viewMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    this.viewMonth = this.viewMonths[this.startDate.month()];
    this.viewDate = this.startDate.date();
    this.viewYear = this.startDate.year();
  }


  //crud functions
  Events.prototype.createEvent= function(date,eventText,length){
    var eventId = this.eventId++;
    var events = this.events;
    if(length > 1){
      var eventType = "multiDay";
    }else{
      var eventType = "singleDay";
    }


    var evt = {
      "id":eventId,
      "eventText" : eventText,
      "eventType": eventType,
      "eventLength": parseInt(length),
      "date": ''
    }
    var newDates = [];
    var newDate = moment.utc(date).set({hour:0,minute:0,second:0,millisecond:0});
    newDates.push(newDate.toISOString());
    for(var x = 0; x < length - 1 ;x++){
      newDate = moment.utc(newDate).add(1,'d');
      newDate = newDate.toISOString();
      newDates.push(newDate);
    }
    evt.date = newDates;
    events.push(evt);
    return evt;
  }

  //@params(eventId,{eventText, length})
  Events.prototype.updateEvent = function(id,object){
    //search for specified event by id
    var evt = this.searchEvent(id);
    //if eventText is specified and does not equal an empty string
    //set the event text to the new event text
    if(typeof object.eventText !== 'undefined' && object.eventText.trim !== ''){
      evt.eventText = object.eventText;
    }

    //if the object length is not undefined
    //build a new array of dates and overwrite the old event.date
    if(typeof object.length !== 'undefined'){
      var newDates = [];
      var objectLength = object.length;
      var eventType = (objectLength > 1)? "multiDay":"singleDay";
      var newDate = evt.date[0];
      newDates.push(newDate);
      for(var x = 0; x < objectLength - 1 ;x++){
        newDate = moment.utc(newDate).add(1,'d');
        newDate = newDate.toISOString();
        newDates.push(newDate);
      }
      evt.date = newDates;
      evt.eventLength = objectLength;
      evt.eventType = eventType;
    }
    return evt;
  }

  //@params(eventId)
  Events.prototype.removeEvent = function(id){
    var events = this.events;
    for(var i = 0;i < events.length;i++){
      if(parseInt(events[i].id) === parseInt(id)){
        events.splice(i,1);
        break;
      }
    }
  }

  //searches single Events by event id
  Events.prototype.searchEvent = function(id){
    var events = this.events;
    for(var x = 0; x < events.length;x++){
      if(parseInt(id) === parseInt(events[x].id)){
        return events[x];
      }
    }
  }

  //returns all events that match the ISO date
  Events.prototype.searchEventsByDate = function (date){
    var foundEvents=[];
    var events = this.events;
    for(var x = 0; x < events.length;x++){
      for(var y = 0; y < events[x].date.length;y++){
        if(events[x].date[y] === date){
          foundEvents.push(events[x]);
          continue;
        }
      }
    }
    //console.log(foundEvents)
    return foundEvents;
  }

  Events.prototype.updateViewDate = function(date){
    var dateISO = moment.utc(date).toISOString();
    var date = moment.utc(date);
    this.currentViewDate = date;
    this.currentViewDateISO = dateISO;
    this.currentViewDateString = date.format('ddd, MMM Do YYYY');
    this.viewMonth = this.viewMonths[date.month()];
    this.viewDate =date.date();
    this.viewYear = date.year();
  }

  Events.prototype.daysToDates = function(startDate,days){
    var startDate = moment.utc(startDate).set({hour:0,minute:0,second:0,millisecond:0});
    var newDateArray = [];
    for(var x = 0; x < days.length;x++){
      var day = days[x];
      var newDay = moment.utc(startDate).add(day,'days');
      var newDay = newDay.toISOString();

      newDateArray.push(newDay);
    }
    return newDateArray;
  }

  Events.prototype.resetStartDate = function(date){
    var dayLimit = 90;
    this.startDate = moment.utc(date).set({hour:0,minute:0,second:0,millisecond:0});
    var offset = this.startDate.utcOffset();
    this.startDateISO = moment.utc(this.startDate).set({minute:offset}).toISOString();
    this.currentDateISO = this.startDate.toString();
    this.currentViewDate = this.startDate;
    this.currentViewDateISO = this.startDateISO;
    this.currentViewDateString = moment(this.startDate).format('ddd, MMM Do YYYY');
    this.endDate = moment(this.startDate).add(dayLimit - 1, 'd');
    this.endDateISO = moment.utc(this.endDate).set({minute:offset}).toISOString();
    this.viewMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    this.viewMonth = this.viewMonths[this.startDate.month()];
    this.viewDate = this.startDate.date();
    this.viewYear = this.startDate.year();
  }
  return {
    Events:new Events()
  }
})();
