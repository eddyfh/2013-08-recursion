var db = require('./db');
var User = db.User;
var Post = db.Post;
var twitter = require('./twitter');
var request = require('request');
var apikey = require('../express-server').apikey;
var passport = require('passport');
// var rss = require('../rsstest'); // this file should be moved

module.exports = function(app, config){
  // app.post('/newacct', function(req, res, next){
  //   console.dir(req.body.password);
  //   db.addUser(config, req.body.username, req.body.password);
  //   // console.log(req);
  //   // console.log(res);
  //   res.render('test', {user: req.user});
  // });

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

// Get user's followed companies, find posts mentioning these companies
  app.get('/rss', function(req, res){
    var user = JSON.parse(req.query['user']);
    companiesArray = user.following;
    for (var i = 0; i < companiesArray.length; i++){
      console.dir(companiesArray[i]);
      companiesArray[i]=companiesArray[i].toLowerCase();
      console.dir(companiesArray[i]);
    }
    // console.log('in /rss');
    console.dir(companiesArray);
    // console.log(Array.isArray(companiesArray));
    // console.log('companiesArray:', companiesArray);
    // companiesArray = ['google', 'instagram'];
    // var start = new Date(2013, 8, 20);
    // var end = new Date(2013, 8, 21);
    Post.find({companies: {$in: companiesArray}}).sort('-pubdate').limit(20).exec(function(err, docs){
      console.log(docs);
      res.send(docs);
    });
  });

  // app.get('/asdf', function(req, res){
  //   res.render('test', { tester: true});
  // });

  app.post('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

  // API server test
  app.get('/api', function(req,res){ 
    // console.log('in app.get');
    // console.log(req.query[0]);
    var compName = req.query[0]; // THIS SHOULD BE MADE MORE GENERIC
    request.get('http://api.crunchbase.com/v/1/companies/posts?name='+compName+'&api_key='+apikey, 
      function(e,response,body){
      // console.log(body);
      res.send(body);
    });
  });

  // app.get('/rss', function(req, res){
  //   console.log('==getting rss data==');
  //   var results = rss();
  //   console.log(results);
  //   res.send(results);
  // });

// NEED TO FIX SO THAT ADDS COMPANIES CORRECTLY
// First retrieves existing companies being followed, then adds new company to follow
  app.post('/followPost', function(req, res){
    var user = JSON.parse(req.query['user']);
    var companies = user.following;
    var userId = user.userId;
    console.log(userId);
    var setvar = {$set: {}};
    setvar.$set['following'] = companies;
    User.update({userId: userId}, setvar, function(){
      // can do something here
    });
    setvar.$set['email'] = user.email; // combine w/ prev?
    User.update({userId: userId}, setvar, function(){
      // can do something here
    });
    // console.log(companies);
  	// req.query[0] = JSON.parse(req.query[0]);
  	// console.dir(req.query[0]);
    // console.log('in followpost');
    // if (typeof(req.query[0] === 'string')){
    // 	console.log('string');
    // 	console.dir(req.query[0]);
    // } else if (Array.isArray(req.query[0])) {
      // console.log('in array');
      // console.log(req.query[0].length);
      // for (var i = 0; i < req.query[0].length; i++){
		    // var companyName = req.query[0];
		    // var reqUserId = req.query[1];
		    // User.find({userId: reqUserId}, function(err, user){
		    //   var companiesFollowed = user[0]['following'] || {};
		    //   // Get # of posts from crunchbase for given company
		    //   request.get({
		    //     url: 'http://api.crunchbase.com/v/1/companies/posts?name='+companyName+'&api_key='+apikey,
		    //     json: true}, 
		    //   function(e,response, body){
		    //     companiesFollowed[companyName] = body['num_posts'];
		    //     var setvar = {$set: {}};
		    //     setvar.$set['following'] = companiesFollowed; // Need to do it this way to use update properly
		    //     User.update({userId: reqUserId}, setvar, function(){
		          // can do something here
        // });
      // });
    // });
    // }
  // } // if statement
  });

  app.get('/startTwitter', function(req, res){
    var following = JSON.parse(req.query[0]);
    console.dir(following);
    var followString=[];
    for (var key in following){
      followString.push(key);
    };
    followString = followString.join();
    twitter(followString);
  });

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

  // app.get('/userSelections', function(req, res){
  //   res.render('userSelections');
  // });

  app.get('/login', function(req, res){ // this is for failed login
    res.render('test', { user: req.user });
  });

  app.get('/loggedin', function(req, res) {
    console.log('In /loggedin - user is:');
    console.log(req.user);
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/emailsubmit', function(req, res){
    console.log('in emailsubmit');
    var emailNew = (req.query[0]);
    var userid = JSON.parse(req.query[1])['_id'];
    User.findById(userid, function(err,docs){
      docs.email = emailNew;
      docs.save();
    });
  });

app.get('/getCompanyList', function(req, res){
  console.log('in getcompanylist');
  // console.log(db.loadedCompanyList);
  res.send(db.loadedCompanyList);
});
// WORKING ON THIS
app.get('/api/crunchbase/profile', function(req,res){
  var compName = req.query[0];
  var compUrl = db.loadedCompanyList[compName];
  request.get({
        url: 'http://api.crunchbase.com/v/1'+compUrl+'.js?api_key='+apikey},
      function(e,response, body){
  res.send(body);
  });
});

//Delete below
// var rss = require('./rss');
// app.get('/testtest',function(req,res){
//   console.log('in get /testtest');
//   res.send(rss.temptest);
// });

  // Twitter test
  // app.get('/api/twitter', function(req,res){ 
    // var stream = twitter();
    // request.post('https://stream.twitter.com/1.1/statuses/filter.json')
    // .end(function(response){
    //   console.log(response);
      // res.send(stream);
    // })
  // });


};

