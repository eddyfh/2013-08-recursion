

var FeedParser = require('feedparser'),
    request = require('request'),
    db = require('./db'),
    moment = require('moment');

var rssFeeds = module.exports.rssFeeds = [
  'http://pandodaily.com.feedsportal.com/c/35141/f/650422/index.rss',
  'http://www.techmeme.com/feed.xml',
  'http://feeds.feedburner.com/techcrunch/?format=xml',
  'http://allthingsd.com/category/news/feed/',
  'http://feeds.mashable.com/Mashable?format=xml',
  'http://feeds.gawker.com/gizmodo/full?format=xml',
  'http://feeds.feedburner.com/businessinsider?format=xml',
  'http://feeds.feedburner.com/ommalik?format=xml',
  'http://online.wsj.com/xml/rss/3_7455.xml',
  'http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'http://news.ycombinator.com/rss'
];

module.exports.getFeed = function(app, feedUrl){
  console.log('getFeed running==========');
  var feed = [];
  request(feedUrl)
    .pipe(new FeedParser())
    .on('error', function(error) {
      console.error(error);
      return;
    })
    .on('meta', function (meta) {
      // console.log('===== %s =====', meta.title);
    })
    .on('readable', function (data) {
      var stream = this, item;
      while (item = stream.read()) {
        item.date = item.date || item.pubdate || new Date(); // check for one or the other
        // console.log('Retrieved article: ', item.title || item.description);
        feed.push({
          title: item.title,
          summary: item,
          description: item.description,
          url: item.link,
          image: item.image,
          pubdate: item.date,
          source: item.source,
          categories: item.categories
        });
      }
    })
    .on('end', function(){
      var feedTitles=[];
      for (var i = 0; i < feed.length; i++){
        feedTitles.push(feed[i]['title']);
      }
      // db.saveLastPost(feedUrl, feedTitles);
      var feedAdditions=[];
      for (var i = 0; i < feed.length; i++){
        feedAdditions.push(feed[i]);
      }
      console.log('======= NEW FEED ADDITIONS =========');
      // Below is an attempt to properly asynch saves so that it doesn't use up crazy CPU
      // Does not seem to work, may need to switch back to for loop
      // var i = 0;
      // var saveLoop = function(){
      //   if (i >= feedAdditions.length){
      //     return;
      //   }
      //   setTimeout(saveLoop, 0);
      for (var i = 0; i < feedAdditions.length; i++){
        // Make sure this matches the savePost arguments required!
        db.savePost(
          feedAdditions[i].title,
          feedAdditions[i].summary,
          feedAdditions[i].description,
          feedAdditions[i].url,
          feedAdditions[i].image.url,
          feedAdditions[i].image.title,
          moment(feedAdditions[i].pubdate).format('MMMM Do YYYY h:mm a'),
          feedAdditions[i].source,
          feedAdditions[i].categories,
          db.checkCompanyList(feedAdditions[i].title, feedAdditions[i].categories)
        );
        // i++;
      }; // end saveLoop
      // saveLoop();
      // };
  });
};

      // REMOVED - we're already checking before saving to db?
        // var lastFeed;
  // db.getLastPost(feedUrl, function(data){
  //   if (data[0]){
  //     lastFeed = data[0].posts;
  //   } else {
  //     lastFeed = [];
  //   }
  // });
        // console.log(feed[i].pubdate);
      //   for (var j = 0; j < lastFeed.length; j++){
      //     if (feed[i]['title'] === lastFeed[j]){
      //       duplicate = true;
      //     }
      //   }
      //   if (!duplicate){
      //   }
      //   duplicate = false;
      // console.log(feedAdditions);
      // for (var i = 0; i < feedAdditions.length; i++){
      // }
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