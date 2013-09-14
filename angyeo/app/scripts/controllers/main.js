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
    $scope.queried = false;

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
      $http({method: 'GET', url: '/api', params: [query]}).success(function(postdata){
        $scope.numPosts = postdata['num_posts'];
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
      $http({method: 'POST', url: '/dbPost'}).success(function(){
        console.log('added to DB');
      });
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
  }]);
  // .controller('NewCtrl', ['$scope', function($scope){}
  //   $scope.testData;
  // ]);



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
