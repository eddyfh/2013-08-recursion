var http = require('http');
var requester = require('./requester');
var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(requester.handleRequest);
console.log('Listening on http://'+ip+':'+port);
server.listen(port, ip);