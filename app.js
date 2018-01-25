'use strict';
process.env.NODE_ENV = 'development';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helmet = require('helmet');


var app = express();
app.use(helmet());
var port = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/striv4");
var db = mongoose.connection;



// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
  secret: 'striv4 your goals',
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
app.use(logger('dev'));

var api = require('./app_api/routes/index');
var serverRoutes = require('./server/routes/index');

//static file middleware
app.use(express.static(__dirname + '/public'));
app.set('views',__dirname +'/server/views');
app.set('view engine','pug');
app.use(flash());
app.use('/',serverRoutes);
app.use('/api',api);



//custom error handler
app.use(function(error, req, res, next) {
  res.status(error.status || 500);
  res.send('Error: '+error.message);
});
app.listen(port);
console.log('Listening on port: '+port);