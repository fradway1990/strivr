var moment = require('moment');
function renderCalendar(startDate){
  var calendarMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
  var daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var dayLimit = 90;
  if(typeof startDate === 'undefined'){
    var startingDay = moment().set({hour:0,minute:0,second:0,millisecond:0});
  }else{
    var startingDay =  moment.utc(startDate).set({hour:0,minute:0,second:0,millisecond:0});
  }
  var utcStart = moment.utc(startingDay).set({hour:0,minute:0,second:0,millisecond:0});
  var endingDay = moment(startingDay).add(dayLimit -1,'days');
  var utcEnd = moment.utc(endingDay).set({hour:0,minute:0,second:0,millisecond:0});
  var startingMonth = startingDay.month();
  var endingMonth = endingDay.month();
  var totalMonths = Math.abs(endingMonth - startingMonth) + 1;
  var currentDay = moment.utc().toISOString();

  //begin constructing calendar
  var html = '';
  var monthIndex = startingMonth
  var year = startingDay.year();
  for(var x = 0;x < totalMonths; x++){
    html+= "<div class='step calendar-card'>";
    html+="<div class='month-scroll'>";
    if(x !== 0){
      html+= "<span class='left-arrow'>&#10094;</span>";
    }
    if(x !== 0){
      monthIndex++;
      if(monthIndex === 12){
        monthIndex = 0;
        year++;
      }
    }
    html+= "<span class='month-name'>"+calendarMonths[monthIndex]+"</span>";
    if(x !== totalMonths - 1){
      html+= "<span class='right-arrow'>&#10095;</span>";
    }
    //close month scroll
    html+="</div>"
    //day list
    html+="<ul class='day-list'><li>Su</li><li>Mo</li><li>tu</li><li>We</li><li>Th</li><li>Fr</li><li>Sa</li></ul>";
    html+= generateWeeks(monthIndex,year);
    //close calendar card
    html+="</div>"
  }



  function generateWeeks(month,year){

    var daysInMonth = daysInMonths[month];
    if(moment([year]).isLeapYear() && month === 1){
      daysInMonth = 29;
    }
    var weeksInMonth = Math.ceil(daysInMonth/7)+1;
    var daysBeforeStart = new Date(year,month,1).getDay();
    var counter = 1;
    var html = '';
    for(var x = 0; x < weeksInMonth;x++){
      html+="<ul class='week-row'>";
        for(var y = 0; y < 7;y++){
          if(daysBeforeStart > 0){
            html += "<li></li>";
            daysBeforeStart--;
            continue;
          }
          if(counter <= daysInMonth && daysBeforeStart === 0){
            var date = moment.utc([year,month,counter]);
            var dateString = date.toISOString();
            var dateClass = 'valid';
            if(date.isBefore(utcStart) || date.isAfter(utcEnd)){
              dateClass='invalid'
            }
            html+="<li class='"+dateClass+"' id='"+dateString+"'><span class='day-fill'>"+counter+"</span></li>";
            counter++;
          }else{
            html+='<li></li>';
          }
        }
      html+="</ul>";
    }

    return html;
  }
  return {
    "currentDay":currentDay,
    "html":html
  };
}

module.exports.renderCalendar = renderCalendar;
