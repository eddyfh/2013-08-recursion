var mongoose = require('mongoose'),
    config = require('../express-server').config;
var fs = require('fs');
var path = require('path');
var loadedCompanyList = module.exports.loadedCompanyList = {}; // load the company list into an object; this object looks like 
var request = require('request');
var apikey = require('../express-server').apikey;
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
  following: 'mixed',
  followingKeys: 'mixed'
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
  categories: 'array',
  companies: 'array'
});

var Post = module.exports.Post = mongoose.model('Post', postSchema);

var savePost = module.exports.savePost = function(title, summary, description, url, imageUrl, imageTitle, pubdate, source, categories, companies){
  Post.find({'title': title}).exec(function(err, docs){
    if(docs[0]){
      // duplicate, so do nothing
    }
    else {
      // new title
      var newPost = new Post({
        title: title,
        summary: summary,
        description: description,
        url: url,
        imageUrl: imageUrl,
        imageTitle: imageTitle,
        pubdate: pubdate,
        source: source,
        categories: categories,
        companies: companies
      });
      newPost.save();
    }
  });
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
  crunchUrl: 'string',
  category_code: 'string'
});

var Company = mongoose.model('Company', companySchema);

var saveCompany = function(company, crunchUrl, category_code, cb){
  var newCompany = new Company({
    name: company,
    crunchUrl: crunchUrl,
    category_code: category_code
  });
  newCompany.save(cb);
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
// Clears out db, then creates all new list - can delete?
// var createCompanyList = module.exports.createCompanyList = function(){
//   readList(path.join(__dirname,'../data/companylist.csv'), function(data){
//     console.log(data);
//     function next(i){
//       if(i >= data.length) return;
//       saveCompany(data[i][1], data[i][0], function(err){
//         if(err) throw err;
//         console.log('saved', i);
//         next(i++);
//       });
//     }
//     next(0);
//     console.log('COMPANY MASTER LIST SAVED TO DB');
//   });
// };

// Could try to use regex to find matches, but prob easier to convert everything to lcase
// Fn takes an article title, checks for any company matches, returns array of matches
var checkCompanyList = module.exports.checkCompanyList = function(title, categories){
  // console.log(loadedCompanyList,'in checkCoList');
  var results = [];
  var lcaseCompanyList=[];
  for (var key in loadedCompanyList){
    lcaseCompanyList[key.toLowerCase()] = loadedCompanyList[key];
  }
  // console.log(lcaseCompanyList);
  titleWords = title.toLowerCase().split(' ');
  wordList = titleWords.concat(categories);
  // console.log(wordList);
  for (var i = 0; i < wordList.length; i++){
    if (lcaseCompanyList[wordList[i]]){
      results.push(wordList[i]);
    }
  }
  // check for 2- and 3-word company names
  for (var i = 0; i < wordList.length - 1; i++){
    if (lcaseCompanyList[wordList[i]+' '+wordList[i+1]]){
      results.push(wordList[i]+' '+wordList[i+1]);
    }
  }
  for (var i = 0; i < wordList.length - 2; i++){
    if (lcaseCompanyList[wordList[i]+' '+wordList[i+1] + ' ' + wordList[i+2]]){
      results.push(wordList[i]+' '+wordList[i+1]+' '+wordList[i+2]);
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
    console.log(docs.length,' companies in DB');
    for (var i = 0; i < docs.length; i++){
      loadedCompanyList[docs[i].name] = docs[i].crunchUrl;
    }
    // console.log(loadedCompanyList, 'in saveLocal');
  });
};

// BELOW IS TO GET TC COMPANIES:
var getAllCos = module.exports.getAllCos = function(cb){
  console.log('Retrieving all companies list from Crunchbase...');
  request.get('http://api.crunchbase.com/v/1/companies.js?api_key='+apikey,
    function(e,response,body){
      console.log('Finished retrieving!');
      var data = JSON.parse(body);
      // console.log(data[1].name);
      // console.log('/company/'+data[1].permalink);
      // console.log(data[1].category_code);
      var i = 0;
      function next(){
        if(i >= data.length) return cb();
        saveCompany(data[i].name, data[i].permalink, data[i].category_code, function(err){
          if(err) return cb(err);
          console.log('saved', i);
          i++;
          next();
        });
      }
      next(0);
  });
};

// getAllCos(function(){});

//   LastPost.find({feedUrl: feedUrl}, function(err, docs){
//     if (docs[0]){
//       var result = docs[0].posts;
//       return result;
//     } else {
//       return [];
//     }
//   });
// };