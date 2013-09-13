var mongoose = require('mongoose');

module.exports = function(app, config) {
  // var db = mongoose.connect(config.db);
  // var userSchema = new Schema({
  //   userId: 'number',
  //   username: 'string',
  //   displayname: 'string',
  //   queried: 'mixed',
  //   following: 'mixed'
  // });
  // //   username: 'string',
  // //   other: 'string'
  // // });
  // // userSchema.methods.validPassword = function (password){
  // //   if (password === this.password){
  // //     return true;
  // //   } else {
  // //     return false;
  // //   }
  // // }
  // var User = mongoose.model('User', userSchema);
  // // var user = new User({username: 'bob', password: 'bobo'});
  // // user.save;


  // return db;
}

module.exports.addUser = function(config, profile){
  // var db = mongoose.connect(config.db);
  // var userSchema = new Schema({
  //   username: 'string',
  //   displayname: 'string',
  //   queried: 'mixed',
  //   following: 'mixed'
  // });
  // var User = mongoose.model('User', userSchema); // collection is users
  var newuser = new User({username: profile.username, displayname: profile.displayName});
  newuser.save();

  // User.find({},function(err, users){
  //   console.dir(users);
    
  // });

}
// module.exports.findUser = function(config, )
