var mongoose = require('mongoose'),
    config = require('../express-server').config;
var fs = require('fs');
var path = require('path');
var loadedCompanyList = module.exports.loadedCompanyList = {}; // load the company list into an object; this object looks like 
//{companyname: crunchbaseURL}  - probably should not be saved this way

// module.exports.addUser = function(config, profile){
//   var newuser = new User({username: profile.username, displayname: profile.displayName});
//   newuser.save();
// };

var connector = mongoose.connect(config.db);
var userSchema = mongoose.Schema({
  userId: 'number',
  username: 'string',
  displayname: 'string',
  email: 'string',
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
  pubdate: 'string',
  source: 'string',
  companies: 'array'
});

var Post = module.exports.Post = mongoose.model('Post', postSchema);

var savePost = module.exports.savePost = function(title, summary, description, url, imageUrl, imageTitle, pubdate, source, companies){
  var newPost = new Post({
    title: title,
    summary: summary,
    description: description,
    url: url,
    imageUrl: imageUrl,
    imageTitle: imageTitle,
    pubdate: pubdate,
    source: source,
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

var companySchema = mongoose.Schema({
  name: 'string',
  crunchUrl: 'string'
});

var Company = mongoose.model('Company', companySchema);

var saveCompany = function(company, crunchUrl){
  var newCompany = new Company({
    name: company,
    crunchUrl: crunchUrl
  });
  newCompany.save();
};

// May want to clean out 'inc', 'inc.', etc from here
var readList = function(filePath, cb){
  fs.readFile(filePath, 'utf8', function(err, data) {   // need utf8 so garbage isn't returned
    data = data.split('\n');
    for (var i = 0; i < data.length; i++){
      data[i] = data[i].split(',');
      // data[i][0] = data[i][0].toLowerCase();
      // data[i][1] = data[i][1].toLowerCase();
    }
    cb(data);
  });
};
// Clears out db, then creates all new list
var createCompanyList = module.exports.createCompanyList = function(){
  Company.find().remove();
  readList(path.join(__dirname,'../data/companylist.csv'), function(data){
    console.log(data);
    for (var i = 0; i < data.length; i++){
      saveCompany(data[i][1], data[i][0]);
    }
    console.log('COMPANY MASTER LIST SAVED TO DB');
  });
};

// Could try to use regex to find matches, but prob easier to convert everything to lcase
// Fn takes an article title, checks for any company matches, returns array of matches
var checkCompanyList = module.exports.checkCompanyList = function(title){
  var results = [];
  var lcaseCompanyList=[];
  for (var key in loadedCompanyList){
    lcaseCompanyList.push(key.toLowerCase());
  }
  titleWords = title.toLowerCase().split(' ');
  // console.log(titleWords);
  for (var i = 0; i < titleWords.length; i++){
    if (lcaseCompanyList[titleWords[i]]){
      results.push(titleWords[i]);
    }
  }
  // check for 2- and 3-word company names
  for (var i = 0; i < titleWords.length - 1; i++){
    if (lcaseCompanyList[titleWords[i]+' '+titleWords[i+1]]){
      results.push(titleWords[i]+' '+titleWords[i+1]);
    }
  }
  for (var i = 0; i < titleWords.length - 2; i++){
    if (lcaseCompanyList[titleWords[i]+' '+titleWords[i+1] + ' ' + titleWords[i+2]]){
      results.push(titleWords[i]+' '+titleWords[i+1]+' '+titleWords[i+2]);
    }
  }
  if (results.length<1){
    // console.log('none');
    return null;
  } else {
    // console.log(results);
    return results;
  }
};

var saveLocalCompanyList = module.exports.saveLocalCompanyList = function(){
  Company.find().exec(function(err, docs){
    for (var i = 0; i < docs.length; i++){
      loadedCompanyList[docs[i].name] = docs[i].crunchUrl;
    }
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