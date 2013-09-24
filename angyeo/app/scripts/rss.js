

var FeedParser = require('feedparser'),
    request = require('request'),
    db = require('./db'),
    moment = require('moment');

var rssFeeds = module.exports.rssFeeds = [
'http://pandodaily.com.feedsportal.com/c/35141/f/650422/index.rss',
'http://www.techmeme.com/feed.xml',
'http://feeds.feedburner.com/techcrunch/?format=xml',
'http://allthingsd.com/category/news/feed/'
];

module.exports.getFeed = function(app, feedUrl){
  var lastFeed;
  db.getLastPost(feedUrl, function(data){
    if (data[0]){
      lastFeed = data[0].posts;
    } else {
      lastFeed = [];
    }
    // console.log('lastfeed is ');
    // console.dir(lastFeed);
  });
  // app.get('/rss', function(req, res){
  var feed = [];
  io = app.io;
  request(feedUrl)
    .pipe(new FeedParser())
    .on('error', function(error) {
      // always handle errors
      console.error(error);
    })
    .on('meta', function (meta) {
      // do something
      // console.log('===== %s =====', meta.title);
    })
    .on('readable', function (data) {
      var stream = this, item;
      while (item = stream.read()) {
        // console.log(moment(item.pubdate).format("MM-DD-YYYY"));
        // console.log('Got article: ', item.title || item.description);
        feed.push({
          title: item.title,
          summary: item,
          description: item.description,
          url: item.link,
          image: item.image,
          pubdate: item.pubdate,
          source: item.source
        });
      }

      // console.log('feed data is ');
    // res.send();
    // console.dir(feed[1]);
    })
    .on('end', function(){
      // console.log('should be saving');
      var feedTitles=[];
      for (var i = 0; i < feed.length; i++){
        feedTitles.push(feed[i]['title']);
      };
      db.saveLastPost(feedUrl, feedTitles);
      var feedAdditions=[];
      var duplicate = false;
      // Loop checks for duplicates vs. the last time
      for (var i = 0; i < feed.length; i++){
        for (var j = 0; j < lastFeed.length; j++){
          if (feed[i]['title'] === lastFeed[j]){
            duplicate = true;
          }
        }
        if (!duplicate){
          feedAdditions.push(feed[i]);
        }
        duplicate = false;
      }
      console.log('======= NEW FEED ADDITIONS =========');
      // for (var i = 0; i < feedAdditions.length; i++){
        // console.log(feedAdditions[i]['title']);
        // console.log(feed[i]['title']);
        // console.log(lastFeed[i]['title'])
      // }
      for (var i = 0; i < feedAdditions.length; i++){
        // Make sure this matches the savePost arguments required
        db.savePost(
          feedAdditions[i].title, 
          feedAdditions[i].summary, 
          feedAdditions[i].description, 
          feedAdditions[i].link, 
          feedAdditions[i].image.url, 
          feedAdditions[i].image.title,
          moment(feedAdditions[i].pubdate).format("MMMM Do YYYY h:mm a"), 
          feedAdditions[i].source,
          db.checkCompanyList(feedAdditions[i].title)
          );
      };
      
      // Print out companies being added
    });
  // });
};

// delete this line function(title, summary, description, url, imageUrl, imageTitle, companies){
      // var feedAdditions = tempFeed;
      // for (var i = 0; i < tempFeed.length; i++){
      //   for (var j = 0; j < lastFeed.length; j++){
      //     if (tempFeed[i]['title'] === lastFeed[j]['title']){
      //       feedAdditions.splice(i, 1);
      //     }
      //   }
      // }
      // console.log('========================');
      // console.log('Additions:');
      // for (var i = 0; i < feedAdditions.length; i++){
      //   // console.log(feedAdditions[i]['title']);
      // }
      // console.log('+++++++++');
      // for (var i = 0; i < tempFeed.length; i++){
      //   // console.log(feed[i]['title']);
      // }
      // // console.log(tempFeed);
      // lastFeed = tempFeed;