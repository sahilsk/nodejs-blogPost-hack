var express = require('express');
var session = require('express-session');
var errorHandler = require('errorhandler');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');


var exphbs  = require('express-handlebars');
//var routes = require('./routes/index');
//var users = require('./routes/users');
var app = express();


/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

mongoose.connection.once("open", function(){
  console.log("connected to the mongodb");
});


// view engine setup

app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.set('port', process.env.PORT || 3000);

app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
 

/** Controllers 
*/

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var postController = require('./controllers/post');

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);

app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/posts/new' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


// Post controller

//app.get('/posts/new', passportConf.isAuthenticated, postController.getNewPost);
app.get("/posts", postController.getPosts);
app.post('/posts', postController.postNewPost);
app.get('/posts/new',postController.getNewPost);
app.get('/posts/:id', postController.getPost);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



/**
 * Error Handler.
 */
app.use(errorHandler());


module.exports = app;
