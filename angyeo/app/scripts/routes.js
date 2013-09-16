var db = require('./db');
var twitter = require('./twitter');

module.exports = function(app, config){
  app.post('/newacct', function(req, res, next){
    console.dir(req.body.password);
    db.addUser(config, req.body.username, req.body.password);
    // console.log(req);
    // console.log(res);
    res.render('test', {user: req.user});
  });

  app.get('/', function(req, res){
	  res.render('index', { thingy: req.user });
	});


	app.get('/asdf', function(req, res){
	  res.render('test', { tester: true});
	});

	// API server test
	app.get('/api', function(req,res){ 
	  var compName = req.query[0]; // THIS SHOULD BE MADE MORE GENERIC
	  request.get('http://api.crunchbase.com/v/1/companies/posts?name='+compName+'&api_key='+apikey)
	  .end(function(response){
	    res.send(response.res.text);
	  })
	});

	// Twitter test
	app.get('/api/twitter', function(req,res){ 
    var stream = twitter();
	  // request.post('https://stream.twitter.com/1.1/statuses/filter.json')
	  // .end(function(response){
	  //   console.log(response);

	    res.send(stream);
	  // })
	});


};

