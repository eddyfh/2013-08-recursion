var db = require('./db');
var User = db.User;
var Post = db.Post;
var twitter = require('./twitter');
var request = require('request');
var apikey = require('../server').apikey;
var passport = require('passport');

module.exports = function(app, config){

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

// may want to edit/add limits below
// Get user's followed companies, find posts mentioning these companies
  app.get('/rss', function(req, res){
    var user = JSON.parse(req.query['user']);
    companiesArray = user.following;
    // Combine companies & keys user follows
    keywordsArray = companiesArray.concat(user.followingKeys); 
    for (var i = 0; i < keywordsArray.length; i++){
      keywordsArray[i]=keywordsArray[i].toLowerCase();
    }
    Post.find({companies: {$in: keywordsArray}}).sort({pubdate: -1}).exec(function(err, docs){
      var results = docs;
      Post.find({categories: {$in: keywordsArray}}).sort({pubdate: -1}).exec(function(err,keyDocs){
        results = results.concat(keyDocs);
        res.send(docs);
      }); // inner post closed
    }); // outer post closed
  });

  app.post('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

// Below can be cleaned up
  app.post('/followPost', function(req, res){
    var user = JSON.parse(req.query['user']);
    var companies = user.following;
    var keywords = user.followingKeys;
    var userId = user.userId;
    var setvar = {$set: {}};
    var setvar2 = {$set: {}};
    var setvar3 = {$set: {}};
    setvar.$set['following'] = companies;
    User.update({userId: userId}, setvar, function(){
      setvar2.$set['followingKeys'] = keywords;
      User.update({userId: userId}, setvar2, function(){
        setvar3.$set['email'] = user.email; // combine w/ prev?
        User.update({userId: userId}, setvar3, function(){
          //callback
        });
      });
    });
  });

  app.get('/startTwitter', function(req, res) {
    var following = JSON.parse(req.query[0]);
    console.dir(following);
    var followString=[];
    for (var key in following){
      followString.push(key);
    }
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
  console.log('In getcompanylist');
  res.send(db.loadedCompanyList);
});

app.get('/api/crunchbase/profile', function(req,res){
  var companies = JSON.parse(req.query['companies']);
  console.log(companies);
  console.log(companies.length);
  // JUST RUNNING FOR FIRST COMPANY FOR NOW - CHANGE BELOW
  // if (companies[0]){
  //   companies = companies[0];
  // }
  var companyUrl;
  var responses = [];
  for (var i = 0; i < companies.length; i++){
    console.log('Attempting to get from crunchbase:');
    console.log(db.loadedCompanyList[companies[i]]);
    companyUrl = db.loadedCompanyList[companies[i]];
    console.log('http://api.crunchbase.com/v/1/company/'+companyUrl+'.js?api_key='+apikey);
    request.get({
      url: 'http://api.crunchbase.com/v/1/company/'+companyUrl+'.js?api_key='+apikey
      },
      function(e,response, body){
        responses.push(JSON.parse(body));
        console.log(responses.length);
        console.log(companies.length);
        if (responses.length === companies.length){
          res.send(responses);
        }
      });
  };
});


  // };



//Delete below
// var rss = require('./rss');
// app.get('/testtest',function(req,res){
//   console.log('in get /testtest');
//   res.send(rss.temptest);
// });
    // var start = new Date(2013, 8, 20);
    // var end = new Date(2013, 8, 21);


  // API server test
  // app.get('/api', function(req,res){ 
  //   // console.log('in app.get');
  //   // console.log(req.query[0]);
  //   var compName = req.query[0]; // THIS SHOULD BE MADE MORE GENERIC
  //   request.get('http://api.crunchbase.com/v/1/companies/posts?name='+compName+'&api_key='+apikey, 
  //     function(e,response,body){
  //     // console.log(body);
  //     res.send(body);
  //   });
  // });

  // app.get('/rss', function(req, res){
  //   console.log('==getting rss data==');
  //   var results = rss();
  //   console.log(results);
  //   res.send(results);
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

