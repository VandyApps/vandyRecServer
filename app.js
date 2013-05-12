
/**
 * Module dependencies.
 */
console.log("Begin");
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

user = {username: "Brendan",
        password: "Brendan"};

console.log("about to set up middleware");
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine); //add this code for setting up ejs
  app.use(express.favicon());
  //app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
 // app.use(passport.session());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

console.log("Set up middleware");

passport.use(new LocalStrategy( function(username, password, done) {
  if (username === user.username && password === user.password) {

      return done(null, user);
  }
  return done(null, false);
}));

console.log("called passport.use");
//routes
app.get('/', function(req, res) {
  res.render('login', {warning: ''});
});

console.log('getting login');

app.post('/', passport.authenticate('local', {failureRedirect: '/'}) , function(req, res) {
  res.render('index');
});

console.log('post setup');
app.get('/home', function(req, res) {

  res.render('home');
});

console.log('home setup');

app.get('/news', routes.news);
app.get('/hours', routes.hours);
app.get('/groupFitness', routes.groupFitness);
app.get('/traffic', routes.traffic);
app.get('/intramurals', routes.intramurals);
app.get('/programs', routes.programs);


//app.get('/users', user.list);

console.log("defined routes, will serialize");


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

console.log("done serializing");
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
