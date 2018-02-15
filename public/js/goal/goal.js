var GoalJS = (function(){

  function Goal(){
    this.tasks = [];
    this.taskId = 0;
    this.goalName = "";
  }

  Goal.prototype.createSingleTask = function(object){
    var id =  this.taskId;
    var taskText = object.taskText;
    var date = object.date;
    if(taskText.trim() !=='' && date){
      var taskObject = {
        id: id,
        taskText: taskText,
        date:date
      };
      this.tasks.push(taskObject);
      this.taskId++;
      return taskObject;
    }else{
      return false;
    }

  }

  Goal.prototype.deleteTask = function(id){
    var tasks = this.tasks;
    for(var x = 0; x < tasks.length; x++){
      if(tasks[x].id === id){
        console.log(tasks[x]);
        tasks.splice(x,1);
      }
    }
  }
  Goal.prototype.editTask = function(id,taskText){
    var taskFound = false;
    for(var x = 0; x < this.tasks.length; x++){
      if(this.tasks[x].id === id){
        taskFound = true;
        if(taskText.trim() !== ''){
          this.tasks[x].taskText = taskText;
          return true;
        }else{
          return 'error';
        }
      }
    }

    if(!taskFound){
      return false;
    }
  }

  Goal.prototype.getTaskById = function(id){
    for(var x = 0; x < this.tasks.length; x++){
      if(this.tasks[x].id === id){
        return this.tasks[x];
      }
    }
  }

  Goal.prototype.getTasksByDate = function(date){
    var arr = [];
    for(var x = 0; x < this.tasks.length;x++){
      if(this.tasks[x].date === date){
        arr.push(this.tasks[x]);
      }
    }
    return arr;
  }

  Goal.prototype.validateGoal = function(){
    if(this.goalName.trim() ===''){
      return {
        valid:false,
        message:'Please enter a name for this goal.'
      }
    }else if(this.tasks.length < 1){
      return {
        valid:false,
        message: "No tasks have been assigned to this goal."
      }
    }

    for(var x = 0; x < this.tasks.length;x++){
        if(this.tasks[x].taskText.trim() === '' || !moment().date(this.tasks[x]).isValid()){
          return {
            valid:false,
            message:"Task text can not be empty."
          }
        }
    }

    return {
      valid:true,
      message:''
    }

  }

  return {
    Goal:Goal
  }


})();
