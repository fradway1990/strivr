var SlideJS = (function(){
  var sliderCount = 0;
  var windowWidth = $(window).outerWidth();
  var Slider = function(parentDiv){
    var _this = this;
    this.parentDiv = parentDiv;
    this.steps = 0;
    this.sliderId = 'slider-'+sliderCount;
    this.currentStep = 0;
    this.parentWidth = $(parentDiv).width();
    this.init();

    var debounce;

    $(window).on('resize',function(){
      clearTimeout(debounce);
      debounce = setTimeout(function(){
        var oldWidth = _this.parentWidth;
        //console.console.log(oldWidth);
        _this.parentWidth = $(parentDiv).width();
        _this.adjustSliderWidth(oldWidth);
      },100);

    });
  }

  Slider.prototype.init = function(){
    var _this = this;
    console.log('initialized')
    var wrapper = $('<div></div>',{
      "class":'wrapper',
      "id":_this.sliderId
    });
    this.parentDiv.append(wrapper);
    sliderCount++;
    this.adjustSliderWidth();
  }

  Slider.prototype.addStep = function(content){
    var _this = this;
    var step = $('<div></div>',{
      html:content,
      class:'step'
    });
    $('#'+_this.sliderId).append(step);
    _this.steps++;
    if(_this.steps === 1){
      _this.currentStep = 1;
    }
    _this.adjustSliderWidth();

  }

  Slider.prototype.adjustSliderWidth = function(oldWidth){
    var parentWidth =this.parentWidth;
    $('#'+this.sliderId+' .step').width(parentWidth);
    $('#'+this.sliderId).width(parentWidth *this.steps);
    if(typeof oldWidth !== 'undefined' && oldWidth !== parentWidth){
      var percentageChange = parentWidth / oldWidth;
      console.log(percentageChange);
      var oldMargin = parseFloat($('#'+this.sliderId).css('marginLeft'));
      $('#'+this.sliderId).css({marginLeft: oldMargin * percentageChange});
    }


  }

  Slider.prototype.forward = function(numSteps){

    var _this = this;
      var cardWidth = _this.parentWidth;
      $('#'+_this.sliderId).animate({marginLeft:'-='+(cardWidth * numSteps)},200);
      _this.currentStep+=numSteps;
      console.log(_this.currentStep);
  }

  Slider.prototype.back = function(numSteps){
    console.log('going back');
    var _this = this;
    var cardWidth = _this.parentWidth;

    $('#'+_this.sliderId).animate({marginLeft:'+='+(cardWidth * numSteps)},200);
    _this.currentStep-=numSteps;
    console.log(_this.currentStep);
  }

  return {
    Slider:Slider
  }
})();
