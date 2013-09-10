var fs = require('fs');
// var corsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10
// };

// var headers = {"X-Originating-Ip": "199.87.82.66"};
var statusCode = 200;

module.exports.handleRequest = function(req, res){
  console.log('req url is:');
  console.log(req.url);
  if (req.url === '/' && req.method === 'GET'){
    console.log('its here');
    fs.readFile('test.html', function(err,text){
      // res.writeHead(statusCode, corsHeaders);
      res.end(text);
    })
  } else {
  // if (req.method === 'OPTIONS') {
  //   res.writeHead(statusCode, corsHeaders);
  //   res.end();
  // } else {
    console.log('other');
  }

};