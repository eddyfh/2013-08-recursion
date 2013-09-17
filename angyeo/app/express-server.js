// need these two lines?
var mongoose = require('mongoose');
var apikey = 'a72hgev95qzstgam5aukbeqe';
//check location of below
var request = require('request');


var express = require('express');
var app = module.exports = express(),
    http = require('http'),
    server = http.createServer(app),
    io = module.exports.io = require('socket.io').listen(server),
    env       = process.env.NODE_ENV || 'development',
    port = 8000,
    config = require('./config/config')[env];

server.listen(port);

// CAN PROBABLY REFACTOR CODE BELOW TO USE CONFIG.JS

// save environment
config['env'] = env;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

// app.set('view engine', 'ejs');
app.use(express.cookieParser());
// use express.session before passport, so that passport session will work
app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.set('view engine', 'ejs');




app.post('/dbPost', function(req, res){
  console.log(req.query[0]);
  var newentry = {};
  newentry[req.query[0]] = req.query[1];
  // var posts = req.query[1];
  var setvar = {$push: {}};
  setvar.$push['following'] = newentry;
  console.log(setvar);
  User.update({userId: '704345'}, setvar, function(){
    // can do something here
  });
});

// Database
// var data = require('./scripts/db');
var connector = mongoose.connect(config.db);
var userSchema = mongoose.Schema({
  userId: 'number',
  username: 'string',
  displayname: 'string',
  queried: 'mixed',
  following: 'mixed'
});
var User = mongoose.model('User', userSchema);
// MOVE THIS PASSPORT STUFF SOMEWHERE ELSE!!!
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: '507604689332034',
    clientSecret: 'c364629baf5f3bde83202fa80ed376b6',
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ userId: profile.id}, function(err, user) {
      // console.log(profile);
      // console.log('------------------');
      if (err) { return done(err);}
      if (!user) {
        var newuser = new User({
          userId: profile.id,
          username: profile.username,
          displayname: profile.displayName
        });
        newuser.save();
        return done(null, newuser);
      }
      else return done(null, user);
    });
    // console.log(profile);
    // console.log(profile);
    // console.log(profile.name);
    // console.log(profile.displayName);
    

    // return done(null, profile);      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
  }
));

// Redirect the user to Facebook for authentication.  
// Fb redirects user to: /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // alert('alskdf');
    // res.render('index', { user: req.user });
    res.redirect('/');
  });

// app.get('/success', function(req, res){
//   res.render('index');
// });

app.get('/login', function(req, res){ // this is for failed login
  res.render('test', { user: req.user });
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

// Run twitter
require('./scripts/twitter')();

// io.sockets.on('connection', function (socket) {
//   socket.emit('twitter', { hello: 'world' });
// });
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