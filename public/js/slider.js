function Slider(parentDiv){
  this.currentStep = 0;
	this.numSteps = 0;
  this.parentDiv = parentDiv;

  this.init();
}
Slider.prototype.init = function(){
  var calendarSteps = this.parentDiv.getElementsByClassName('step');
  this.numSteps = calendarSteps.length;
  this.adjustStepWidth();
  this.adjustSlider();
}

//function that adjusts wrapper and step widths
Slider.prototype.adjustStepWidth = function(){
  var wrapper = document.querySelector('.wrapper');
  var parentDiv = this.parentDiv;
  var totalWidth=0;
	var menuChildren = parentDiv.getElementsByClassName('step');
  var menuParentWidth = $(parentDiv).width();
  console.log(menuParentWidth)
	//change child width to menu parent width
	for(var j = 0; j < menuChildren.length ; j++){
		$(menuChildren[j]).width(menuParentWidth);

	}
  //add the total width of all of the children
	for(var i = 0; i < menuChildren.length ; i++){
		totalWidth += $(menuChildren[i]).width();
	}
  //change wrapper width
  wrapper.style.display = 'inherit';
	wrapper.style.width = totalWidth+'px';
}

Slider.prototype.switchStep = function(direction){
  var parentDiv = this.parentDiv;
  var parentWidth = $(parentDiv).width();
  var wrapper = parentDiv.querySelector('.wrapper');
  var  currentLeft = parseInt($(wrapper).css('margin-left'));
	if(direction === 'fwd' && this.currentStep < this.numSteps - 1){
		$(wrapper).animate({marginLeft: currentLeft - parentWidth + 'px'});
		this.currentStep++;
	}
	if(direction === 'back' && this.currentStep > 0){
		$(wrapper).animate({marginLeft:(currentLeft + parentWidth) +'px'});
		this.currentStep--;
	}

}

Slider.prototype.adjustSlider= function(){
    var parentDiv = this.parentDiv;
    var oldWidth = $(parentDiv).width();
		var _this = this;
    var wrapper = parentDiv.querySelector('.wrapper');
    var timer;
		$(window).on('resize',function(e){
      clearTimeout(timer);
			//get time when window was resized
      setTimeout(function(){
        var parentDiv = _this.parentDiv;
        var newWidth = $(parentDiv).width();
  			var percentageChange = newWidth / oldWidth;
  			var stepsMargin = $(wrapper).css('margin-left');
  			if(_this.currentStep > 0){
  				$(wrapper).css({'margin-left':parseFloat(stepsMargin) * percentageChange +'px'});
  			}
        _this.adjustStepWidth();
        oldWidth = newWidth;
      },100);
		});

}
