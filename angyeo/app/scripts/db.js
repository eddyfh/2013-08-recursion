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
  //source: 'string',
  title: 'string',
  summary: 'string',
  description: 'string',
  url: 'string',
  imageUrl: 'string',
  imageTitle: 'string',
  pubdate: 'date',
  companies: 'array'
});

var Post = module.exports.Post = mongoose.model('Post', postSchema);

var savePost = module.exports.savePost = function(title, summary, description, url, imageUrl, imageTitle, pubdate, companies){
  var newPost = new Post({
    title: title,
    summary: summary,
    description: description,
    url: url,
    imageUrl: imageUrl,
    imageTitle: imageTitle,
    pubdate: pubdate,
    companies: companies
  });
  newPost.save();
};
// lastPost saves down all the most recent posts for each feed
var lastPostSchema = mongoose.Schema({
  feedUrl: 'string',
  posts: 'mixed'
});
var LastPost = module.exports.lastPost = mongoose.model('LastPost', lastPostSchema);
var saveLastPost = module.exports.saveLastPost = function(feedUrl, posts){
  LastPost.find({feedUrl: feedUrl}).remove();
  var newLastPost = new LastPost({
    feedUrl: feedUrl,
    posts: posts
  });
  newLastPost.save();
};
var getLastPost = module.exports.getLastPost = function(feedUrl, callback){
  LastPost.find({feedUrl: feedUrl}, function(err, docs){
    callback(docs);
  });
};


//   LastPost.find({feedUrl: feedUrl}, function(err, docs){
//     if (docs[0]){
//       var result = docs[0].posts;
//       return result;
//     } else {
//       return [];
//     }
//   });
// };