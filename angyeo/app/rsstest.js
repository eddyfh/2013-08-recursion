

var FeedParser = require('feedparser')
  , request = require('request');

module.exports = function(app){
  app.get('/rss', function(req, res){
    var feed = [];

    request('http://feeds.feedburner.com/techcrunch/fundings-exits?format=xml')
      .pipe(new FeedParser())
      .on('error', function(error) {
        // always handle errors
        console.error(error);
      })
      .on('meta', function (meta) {
        // do something
        // console.log('===== %s =====', meta.title);
      })
      .on('readable', function () {
        // do something else, then do the next thing
        var stream = this, item;
        while (item = stream.read()) {
          // console.log('Got article: %s', item.title || item.description);
          feed.push(item);
        }
        console.log('feed data is ');
        console.dir(feed);
        res.send(feed);
      });
    });
};