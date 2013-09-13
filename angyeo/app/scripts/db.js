var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = function(app, config) {
  // var db = mongoose.connect(config.db);
  // var userSchema = new Schema({
  //   username: 'string',
  //   other: 'string'
  // });
  // userSchema.methods.validPassword = function (password){
  //   if (password === this.password){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // var User = mongoose.model('User', userSchema);
  // var user = new User({username: 'bob', password: 'bobo'});
  // user.save;


  // return db;
}

module.exports.add = function(config, user, pass){
  var db = mongoose.connect(config.db);
  console.log(config.db);
  var userSchema = new Schema({
    username: 'string',
    password: 'string'
  });
  var User = mongoose.model('User', userSchema); // collection is users
  var joe = new User({username: user, password: pass});
  joe.save();

  User.find({},function(err, users){
    console.dir(users);
    
  });

}
