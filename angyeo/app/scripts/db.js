var mongoose = require('mongoose'),
    config = require('../express-server').config;

// module.exports.addUser = function(config, profile){
//   var newuser = new User({username: profile.username, displayname: profile.displayName});
//   newuser.save();
// };

var connector = mongoose.connect(config.db);
var userSchema = mongoose.Schema({
  userId: 'number',
  username: 'string',
  displayname: 'string',
  queried: 'mixed',
  following: 'mixed'
});
var User = module.exports.User = mongoose.model('User', userSchema);

var postSchema = mongoose.Schema({
  source: 'string',
  title: 'string',
  summary: 'string',
  description: 'string',
  url: 'string',
  imageUrl: 'string',
  imageTitle: 'string',
  companies: 'array'
});

var Post = module.exports.Post = mongoose.model('Post', postSchema);