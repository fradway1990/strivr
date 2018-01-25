var calendar = (function(year,month,day){

  var slideJS = SlideJS;
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


})();
