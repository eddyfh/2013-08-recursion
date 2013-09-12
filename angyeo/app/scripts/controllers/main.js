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
      $http({
      method: 'JSONP',
      url: 'http://api.crunchbase.com/v/1/companies/posts?name=orderahead&api_key=a72hgev95qzstgam5aukbeqe'
    }).success(function(data){
        console.log(data);
    }).error(function(data, status){
      console.log(data);
        console.log('ERROR!');
      });
    };

    $scope.userSubmit = function(query){
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

    

  }]);
