'use strict';
if(process.env.NODE_ENV === 'development'){
  var Config = require('./config');
  var secret = Config.SECRET;
}else{
  var secret = process.env.SECRET;
}

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
if(process.env.NODE_ENV === 'development'){
  var logger = require('morgan');
}
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');


var app = express();
var port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  var dbURI = process.env.MONGOLAB_URI;
}else{
  var dbURI = config.DATABASE;
}

mongoose.connect(dbURI);
var db = mongoose.connection;



// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = {
                            username:req.session.username,
                            id: req.session.userId
                          };
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if(process.env.NODE_ENV === 'development'){
  app.use(logger('dev'));
}
var api = require('./app_api/routes/index');
var serverRoutes = require('./server/routes/index');

//static file middleware
app.use(express.static(__dirname + '/public'));
app.set('views',__dirname +'/server/views');
app.set('view engine','pug');
app.use(flash());
app.use('/',serverRoutes);
app.use('/api',api);




app.listen(port);
console.log('Listening on port: '+port);
