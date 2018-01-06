var message = (function(){
  function generateMessage(message,status){
   var messageContainer = document.createElement('div');
   messageContainer.classList.add('message-container');
   if(status==='ok'){
     messageContainer.style.backgroundColor = 'green';
   }else if(status==='error'){
     messageContainer.style.backgroundColor = 'red';
   }else{
     messageContainer.style.backgroundColor = '#EE7738';
   }
   var text = document.createTextNode(message);
   messageContainer.appendChild(text);
   $('body').prepend(messageContainer);
   var timer = setTimeout(function(){
     $(messageContainer).fadeOut(500,function(){
       $(messageContainer).remove();
     });
   },2000);
  }

  function generateAlert(message,callback){
    var alert= $('<div>',{
      id:'alert'
    });
    var alertMessage = $('<p>',{
      text:message,
      id:'alert-message'
    }).appendTo(alert);
    var confirm = $('<button>',{
      type:'button',
      class:'confirm',
      text:'Yes'
    }).appendTo(alert);
    var deny =$('<button>',{
      class:'deny',
      type:'button',
      text:'No'
    }).appendTo(alert);
    var overlay = $('<div>',{
      class:'overlay'
    }).prependTo('body');
    alert.prependTo('body');
    deny.on('click',function(){
      overlay.remove();
      alert.remove();
    });
    confirm.on('click',function(){
      callback();
      overlay.remove();
      alert.remove();
    });
    overlay.on('click',function(){
      overlay.remove();
      alert.remove();
    });
  }

  return {generateMessage: generateMessage,
          generateAlert: generateAlert
          };
})();
