var SlideJS = (function(){
  var sliderCount = 0;
  var Slider = function(parentDiv){
    this.parentDiv = parentDiv;
    this.steps = 0;
    this.sliderId = 'slider-'+sliderCount;
    this.currentStep = 0;
    this.init();
  }

  Slider.prototype.init = function(){
    var _this = this;
    console.log('initialized')
    var wrapper = $('<div></div>',{
      "class":'wrapper',
      "id":_this.sliderId
    });
    sliderCount++;
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

  Slider.prototype.adjustSliderWidth = function(){
    var parentWidth = $(this.parentDiv).width();
    $('#'+this.sliderId+' .step').width(parentWidth);
    $('#'+this.sliderId).width(parentWidth *this.steps);

  }

  Slider.prototype.forward = function(numSteps){

    var _this = this;
      var cardWidth = $(_this.parentDiv).innerWidth();
      $('#'+_this.sliderId).animate({marginLeft:'-='+(cardWidth * numSteps)},200);
      _this.currentStep+=numSteps;
      console.log(_this.currentStep);
  }

  Slider.prototype.back = function(numSteps){
    console.log('going back');
    var _this = this;
    var cardWidth = $(_this.parentDiv).innerWidth();

    $('#'+_this.sliderId).animate({marginLeft:'+='+(cardWidth * numSteps)},200);
    _this.currentStep-=numSteps;
    console.log(_this.currentStep);
  }



  return {
    Slider:Slider
  }
})();
