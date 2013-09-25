var twitter = require('ntwitter');
var app = require('../express-server');
var io = app.io;

var twit = new twitter({
  consumer_key: 'jLuObgS6Yxg2j0Vog0vog',
  consumer_secret: 'Cnadp0cYoVOY2B7EHTy5J9IkTTm8f2MBIze5bYBsE',
  access_token_key: '1865370942-fol02RPXzwgHNlgzJSnYRP34ZDdFQvTLQuq3lBu',
  access_token_secret: 'kqnOrK8iND1WaX74GC6Jso6ORdp32a2kTw0fAxSlbr8'
});

// module.exports = function(companies) {

	// io.sockets.on('connection', function (socket) {
	// 	twit.stream('statuses/filter', {track: companies}, function(stream) {
	// 	  stream.on('data', function (data) {
		  	// TURN BELOW ON
			  // socket.emit('twitter', data);
// 		  });
// 		});
// 	});
// };
	// io.sockets.on('connection', function (socket) {
	//   socket.emit('twitter', { hello: 'world' });
	// });

		// console.log('in socket');
		// var parseTweet = function(tweet) {
	 //    if(!tweet.text) {
	 //      return;
	 //    }

		// // store the body of the tweet
	 //    var text = tweet.text;


	 //  // get everything we want to store
		//   var user = tweet.user,
		//      t = [ 
		//      tweet.user.screen_name, 
		//      user.id, 
		//      tweet.id_str, 
		//      tweet.created_at, 
		//      text, 
		//      user.followers_count, 
		//      user.statuses_count,
		//      tweet.coordinates 
		//   ];
		  // add it to the DB
		  // console.log(t.text);
		// }; 

		// console.log('in twitter func');

		    // console.log(data);
		    // parseTweet(data);
		  // console.log(stream);
		// console.log(newstream);
		// return newstream;
	  // socket.on('my other event', function (data) {
	  //   console.log(data);
	  // });

