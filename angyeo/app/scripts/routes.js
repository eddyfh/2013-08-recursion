var db = require('./db');

module.exports = function(app, config){
  app.post('/newacct', function(req, res, next){
    console.dir(req.body.password);
    db.addUser(config, req.body.username, req.body.password);
    // console.log(req);
    // console.log(res);
    res.render('test', {user: req.user});
  });
};