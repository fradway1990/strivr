var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  taskText : {type:String,required:true},
  date: {type:Date,required:true},
  completed:{type:Boolean,default:false},
  parentId:{ type : mongoose.Schema.Types.ObjectId , ref: 'Goal',required:true }
});


var event = mongoose.model('Task',taskSchema);
