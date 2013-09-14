'use strict';

angular.module('angyeoApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.queries = [];
    $scope.follow = [];

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

    $scope.userSubmit = function(query){
      $http.get('/api').success(function(postdata){
        $scope.postData = 'testest';
      });

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
    };

    $scope.authenticated = function(user){
      console.log(user);
      return user;
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
  }])
  .controller('NewCtrl', ['$scope', function($scope){}
  ]);



  // THIS WORKS FOR CRUNCHBASE SEARCH
  // $http({
  //     method: 'JSONP',
  //     url: 'http://api.crunchbase.com/v/1/search.js?query=orderahead&api_key=a72hgev95qzstgam5aukbeqe&callback=JSON_CALLBACK'
  //   }).success(function(data){
  //       console.log(data);
  //   }).error(function(data, status){
  //     console.log(data);
  //       console.log('ERROR!');
  //     });
  //   };
