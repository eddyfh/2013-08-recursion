

var FeedParser = require('feedparser'),
    request = require('request'),
    db = require('./db');
    lastFeed = [];

module.exports = function(app, feedUrl){
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
      // do something else, then do the next thing
      var stream = this, item;
      while (item = stream.read()) {
        // console.log('Got article: ', item.title || item.description);
        feed.push({
          title: item.title,
          summary: item.summary,
          description: item.description,
          url: item.link,
          image: item.image,
          pubdate: item.pubdate
          // imageUrl: 'string',
          // imageTitle: 'string',
          // companies: 'array'
        });
      }

      // console.log('feed data is ');
    // res.send();
    // console.dir(feed);
    })
    .on('end', function(){
      var temp = feed;
      var feedAdditions=[];
      var duplicate = false;
      for (var i = 0; i < feed.length; i++){
        for (var j = 0; j < lastFeed.length; j++){
          if (feed[i]['title'] === lastFeed[j]['title']){
            duplicate = true;
          }
        }
        if (!duplicate){
          feedAdditions.push(feed[i]);
        }
        duplicate = false;
      }
      console.log('======= NEW FEED ADDITIONS =========');
      for (var i = 0; i < feedAdditions.length; i++){
        db.savePost(
          feedAdditions[i].title, 
          feedAdditions[i].summary, 
          feedAdditions[i].description, 
          feedAdditions[i].link, 
          feedAdditions[i].image.url, 
          feedAdditions[i].image.title,
          feedAdditions[i].pubdate, 
          'testcos'  
          );
      };
      
      // Prints out companies being added
      for (var i = 0; i < feedAdditions.length; i++){
        console.log(feedAdditions[i]['title']);
      }
      lastFeed = temp;
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