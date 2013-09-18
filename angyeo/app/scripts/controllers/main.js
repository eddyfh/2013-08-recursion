'use strict';

angular.module('angyeoApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.queries = [];
    $scope.follow = [];
    $scope.queried = false;
    $scope.tweets = [];
    $scope.user;
    // Retrieves logged in user's data and saves to $scope.user
    $http.get('/loggedin').success(function(user){
      $scope.user = user;
      if ($scope.user.following){
        for (var key in $scope.user.following) {
          $scope.follow.push(key);
        } 
      }
    });

    $scope.logout = function(){
      $http.post('/logout');
    };

    // twitterstream
    var socket = io.connect('http://localhost');
    socket.on('twitter', function (data) {
      $scope.tweets = data;
      $scope.$apply();
      // socket.emit('my other event', { my: 'data' });
    });

    $scope.checkPosts = function(name){
    //   $http({
    //   method: 'JSONP',
    //   url: 'http://api.crunchbase.com/v/1/companies/posts?name=Google&api_key=a72hgev95qzstgam5aukbeqe&callback=JSON_CALLBACK'
    // }).success(function(data){
    //     console.log(data);
    // }).error(function(data, status){
    //   console.log(data);
    //     console.log('ERROR!');
    //   });
    };

    $scope.userSubmit = function(query){ // THESE TWO SHOULD BE COMBINED INTO 1 REQUEST
      // $http({method: 'GET', url: '/api', params: [query]}).success(function(postdata){
      //   $scope.numPosts = postdata['num_posts'];
      // });

      $http({
      method: 'JSONP',
      url: 'http://api.crunchbase.com/v/1/company/'+query+'.js?api_key=a72hgev95qzstgam5aukbeqe&callback=JSON_CALLBACK'
    }).success(function(data){
        console.log(data);
        data.posts = $scope.checkPosts(data.name);
        $scope.queries.push(data);
    }).error(function(data, status){
        console.log('ERROR!');
      });

    };

    
    $scope.userFollow = function(name){
      $scope.follow.push(name);
      $http({method: 'POST', url: '/followPost', params: [name, $scope.user.userId]}).success(function(){
        // console.log('added to DB');
      });
    };

    $scope.authenticated = function(user){
      console.log(user);
      return user;
    };
    
    $scope.twitterStream = function(){
    };
    
  }])
  .controller('TestCtrl', ['$scope', '$http', function($scope, $http){
    $scope.testthing = function(input){
      console.log(input);
      return input;
    };
    $scope.showfunc = function(){
      return false;
    };
  // }])
  // .factory('UserService', [function(){
  //   var userObj = {
  //     isLogged: false,
  //     username: ''
  //   };
  }]);
  // .controller('NewCtrl', ['$scope', function($scope){}
  //   $scope.testData;
  // ]);