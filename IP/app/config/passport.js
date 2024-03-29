var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , User = require('../scripts/db').User;


module.exports = function(app) {

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	// Middleware function to be used for secured routes
	var auth = function(req, res, next){
	  if (!req.isAuthenticated()) 
	    res.send(401);
	  else
	    next();
	};

	passport.use(new FacebookStrategy({
	    clientID: '507604689332034',
	    clientSecret: 'c364629baf5f3bde83202fa80ed376b6',
	    callbackURL: "/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    User.findOne({ userId: profile.id}, function(err, user) {
	      console.log(profile);
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
	  }
	));

	
};
