
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var https = require('https');
var http = require('http');


var port     = process.env.PORT || 8282;




var passport = require('passport');
var flash    = require('connect-flash');

// connect to our database

require('./config/passport')(passport);



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
/*
app.listen(port);
console.log('The magic happens on port ' + port);
//*/

var httpServer = http.createServer(app);


httpServer.listen(port, function () {
	console.log('The magic http happens on port ' + port);
});
