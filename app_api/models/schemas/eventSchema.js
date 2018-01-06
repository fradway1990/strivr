var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  eventText : {type:String,required:true},
  eventType:{type:String,required:true},
  eventLength: {type: Number,required:true},
  date: {type:Date,required:true},
  completed:{type:Boolean,default:false},
  siblingId:{ type : mongoose.Schema.Types.ObjectId , ref: 'Event',required:true },
  parentId:{ type : mongoose.Schema.Types.ObjectId , ref: 'Goal',required:true }
});


var event = mongoose.model('Event',eventSchema);
