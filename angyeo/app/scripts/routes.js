var db = require('./db');
var User = db.User;
var twitter = require('./twitter');
var request = require('request');
var apikey = require('../express-server').apikey;
var passport = require('passport');
// var rss = require('../rsstest'); // this file should be moved

module.exports = function(app, config){
  app.post('/newacct', function(req, res, next){
    console.dir(req.body.password);
    db.addUser(config, req.body.username, req.body.password);
    // console.log(req);
    // console.log(res);
    res.render('test', {user: req.user});
  });

  app.get('/', function(req, res){
	  res.render('index', { user: req.user });
	});

	app.get('/asdf', function(req, res){
	  res.render('test', { tester: true});
	});

	app.post('/logout', function(req, res){
		req.logOut();
		res.redirect('/');
	});

	// API server test
	app.get('/api', function(req,res){ 
		console.log('in app.get');
		// console.log(req.query[0]);
	  var compName = req.query[0]; // THIS SHOULD BE MADE MORE GENERIC
	  request.get('http://api.crunchbase.com/v/1/companies/posts?name='+compName+'&api_key='+apikey, 
	  	function(e,response,body){
	  	// console.log(body);
	    res.send(body);
	  });
	});

	// app.get('/rss', function(req, res){
	// 	console.log('==getting rss data==');
	// 	var results = rss();
	// 	console.log(results);
	// 	res.send(results);
	// });

// First retrieves existing companies, then adds new company to follow
	app.post('/followPost', function(req, res){
		var companyName = req.query[0];
		var reqUserId = req.query[1];
		User.find({userId: reqUserId}, function(err, user){
			var companiesFollowed = user[0]['following'] || {};
			// Get # of posts from crunchbase for given company
			request.get({
				url: 'http://api.crunchbase.com/v/1/companies/posts?name='+companyName+'&api_key='+apikey,
				json: true}, 
			function(e,response, body){
				companiesFollowed[companyName] = body['num_posts'];
			  var setvar = {$set: {}};
			  setvar.$set['following'] = companiesFollowed; // Need to do it this way to use update properly
			  User.update({userId: reqUserId}, setvar, function(){
		      // can do something here
				});
		  });
			
		});
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

	app.get('/login', function(req, res){ // this is for failed login
	  res.render('test', { user: req.user });
	});

	app.get('/loggedin', function(req, res) {
	  console.log('In /loggedin - user is:');
	  console.log(req.user);
	  res.send(req.isAuthenticated() ? req.user : '0');
	});

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

