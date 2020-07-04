var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql= require('mysql');
var http = require('http');
var cors = require('cors');
var passport    = require('passport');
var swaggerJSDoc = require('swagger-jsdoc');

var index = require('./routes/index');
var tracking = require('./routes/tracking');
var users = require('./routes/user');
var auth = require('./routes/auth');

var app = express();

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Expenses Swagger API',
    version: '1.1.0',
    description: 'Endpoints for Expenses API',
  },
  host: 'harinpurumandla.com',
  basePath: '/workspace/api/expenses/v1',
};
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
  };
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

var config = require('./config/database'); // get db config file


app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
	  	host     : config.host,
      user     : config.user,
      password : config.password,
  		database : config.database
	});
	connection.connect();
	next();
});
app.get('/api/v1/swagger.json', function(req, res) {   res.setHeader('Content-Type', 'application/json');   res.send(swaggerSpec); });
app.use('/api/v1', index);
app.use('/api/v1/tracking',passport.authenticate('jwt', { session: false}), tracking);
app.use('/api/v1/user',passport.authenticate('jwt', { session: false}), users);
app.use('/api/v1/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).send(JSON.stringify({"status": 404, "error": "End Point Not Found", "response": null}));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.setHeader('Content-Type', 'application/json');
  // render the error page
  res.status(err.status || 500).send(JSON.stringify({"status": err.status || 500, "error": res.locals.message, "response": null}));
});

module.exports = app;
var server = http.createServer(app);
server.listen(process.env.PORT || 4001);
