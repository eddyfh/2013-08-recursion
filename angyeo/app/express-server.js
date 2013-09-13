
var express = require('express');
var app = module.exports = express(),
    env       = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];
var port = 8000;
// CAN PROBABLY REFACTOR CODE BELOW TO USE CONFIG.JS

// save environment
config['env'] = env;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

// app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

// Database
var db = require('./scripts/db')(app, config);

// MOVE THIS PASSPORT STUFF SOMEWHERE ELSE??
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: '507604689332034',
    clientSecret: 'c364629baf5f3bde83202fa80ed376b6',
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// USE THIS?
// function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/success',
                                      failureRedirect: '/login' }));

app.get('/success', function(req, res){
  res.render('fb', { user: req.user });
});

// app.post('/', function(req, res){
//   console.log(req.body);
//   res.writeHead(200, {'content-type':'text/html'});
//   res.end('POST');
//   // res.redirect('back');
// });


//MONGOOSE TEST
// var config = {};
// config.routes = {};
// config.routes.feed = '/user';
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:8000/newdb');

// Schema = mongoose.Schema;
// var User = new Schema({
//   username: String,
//   title: String
// });
// var userModel = mongoose.model('User', User);
// var user = new userModel();

// user.username = 'Chad';
// user.title = 'dev';
// user.save(function(err){
//   console.log('Saved, starting server...');
//   app.listen(8000);
// });
// app.configure(function(){
//   console.log('I will listen on '+config.routes.feed);
// });

// app.get(config.routes.feed, function(req, res){
//   res.contentType('application/json');
//   userModel.findOne({'username':'Chad'}, function(err, user){
//     if (user !=null){
//       console.log('Found User: '+user.username);
//       res.send(JSON.stringify(user));
//     }
//   });
// });

// Routes
require('./scripts/routes')(app, config);


app.listen(port);
console.log('Express server listening on port '+port);




/*
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/