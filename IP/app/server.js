var express = require('express'),
    app = module.exports = express(),
    http = require('http'),
    server = http.createServer(app),
    // io = module.exports.io = require('socket.io').listen(server),
    env = process.env.NODE_ENV || 'development',
    config = module.exports.config = require('./config/config')[env],
    apikey = module.exports.apikey = 'a72hgev95qzstgam5aukbeqe',
    fb = require('./config/passport')(app),
    rss = require('./scripts/rss');
    app.configure(function(){
      app.set('port', process.env.PORT || 8000);
      console.log(app.get('port'));
    });

server.listen(app.get('port'));
console.log('Express server listening on port ');

// CAN PROBABLY REFACTOR CODE BELOW TO USE CONFIG.JS
// save environment
config['env'] = env;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
app.use(express.cookieParser());
// use express.session before passport, so that passport session will work
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.set('view engine', 'ejs');

// Database
var db = require('./scripts/db'),
    User = db.User; // need this?

// Routes
require('./scripts/routes')(app, config);

// Loop through, run RSS fetch every 2 minutes, fetching one feed every 10 seconds
var i = 0;
var rssLoop = function(){
  if (i >= rss.rssFeeds.length){
    // when loop finished
    return;
  }
  setTimeout(rssLoop, 10000);
  rss.getFeed(app, rss.rssFeeds[i]);
  i++;
};
rssLoop();

setInterval(function(){
  var i = 0;
  var rssLoop = function(){
    if (i >= rss.rssFeeds.length){
      // when loop finished
      return;
    }
    setTimeout(rssLoop, 10000);
    rss.getFeed(app, rss.rssFeeds[i]);
    i++;
  };
  rssLoop();
}, 120000);
// if (i < rss.rssFeeds.length){
//   rss.getFeed(app, rss.rssFeeds[i]);
//   i++;
// }

// for (var i = 0; i < rss.rssFeeds.length; i++){
//   rss.getFeed(app, rss.rssFeeds[i]);
// }
// // Run RSS feed fetching every 2 mins - this currently seems to slow down server big time
// //=======================================
// setInterval(function(){
//   for (var i = 0; i < rss.rssFeeds.length; i++){
//     rss.getFeed(app, rss.rssFeeds[i]);
//   }}, 120000);
//=======================================

db.saveLocalCompanyList(); // Saves list in db to local variable

// io.sockets.on('connection', function (socket) {
//         twit.stream('statuses/filter', {track: companies}, function(stream) {
//           stream.on('data', function (data) {
//             socket.emit('twitter', data);
//           });
//         });
//       });


// db.createCompanyList(); // DON'T RUN EVERY TIME
// console.log(db.loadedCompanyList);
// setTimeout(function(){
//   console.log('results is ', db.checkCompanyList('VMware is in the title'));
// }, 2000);db.testPost();

// Run twitter
// require('./scripts/twitter')();

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