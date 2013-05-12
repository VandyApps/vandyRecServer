
/**
 * Module dependencies.
 */

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


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine); //add this code for setting up ejs
  app.use(express.favicon());
  app.use(express.cookieParser());
  //session middleware needs to be called after the cookie parder middleware
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


passport.use(new LocalStrategy( function(username, password, done) {
  if (username === user.username && password === user.password) {

      return done(null, user);
  }
  return done(null, false);
}));

//routes
app.get('/', function(req, res) {
  res.render('login', {warning: ''});
});

app.post('/', passport.authenticate('local', {failureRedirect: '/'}) , function(req, res) {
  res.render('index');
});

app.get('/home', function(req, res) {

  res.render('home');
});

//client routing
app.get('/news', routes.news);
app.get('/hours', routes.hours);
app.get('/groupFitness', routes.groupFitness);
app.get('/traffic', routes.traffic);
app.get('/intramurals', routes.intramurals);
app.get('/programs', routes.programs);


//app.get('/users', user.list);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
