var moment = require('moment');
function renderCalendar(year,month,day){
  var requestedDate = moment([year,month,day]);
  var daysInMonth = requestedDate.daysInMonth();

  var monthName = requestedDate.format('MMMM');
  var year = requestedDate.format('YYYY');
  var n_month = requestedDate.month();
  var n_year = requestedDate.year();
  var n_date = requestedDate.date();
  var startingDay = moment([n_year,n_month,1]).day();
  var weeksInMonth = Math.ceil(daysInMonth /7)+1;
  console.log(weeksInMonth);
  //construct calendar
  var html = "<div class='calendar-card'>";
    html+="<div class='month-scroll'>"
     html+= "<span class='month-name'>"+monthName+"</span>";
     html+="</div>";
     html+="<ul class='day-list'><li>Su</li><li>Mo</li><li>tu</li><li>We</li><li>Th</li><li>Fr</li><li>Sa</li></ul>";
     var counter = (startingDay * -1) +1;
      for(var x = 0; x < weeksInMonth ;x++){
        html+= "<ul class='week-row'>";
          for(var y = 0; y < 7; y++){
            if(counter <= 0 || counter > daysInMonth){
              html+='<li></li>';
              counter++;
            }
            else{
              var calendarDate = moment([n_year,n_month,counter]).startOf('day');
              var currentDay = requestedDate.startOf('day');
              var dateId= calendarDate.startOf('day').toISOString();
              var dateClass= 'valid';
              if(calendarDate.isBefore(currentDay)){
                dateClass = 'invalid';
              }
              html+='<li id="'+dateId+'" class="'+dateClass+'"><span class="day-fill">'+counter+'</span></li>';
              counter++;
            }
            console.log(counter);
          }

        html+= "</ul>";
      }
    html +="</div>";
  html +="</div>";
  return {html:html};
}

module.exports.renderCalendar = renderCalendar;
