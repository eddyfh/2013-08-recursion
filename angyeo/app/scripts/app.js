'use strict';

var crunchlApp = angular.module('angyeoApp', ['ui.bootstrap'])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.resolve, 0);
        }
        // Not Authenticated
        else {
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });
      return deferred.promise;
    };

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.ejs',
      })
      .otherwise({
        redirectTo: '/catchallurl'
      });

  });

crunchlApp.factory('sharedServices', ['$http', function($http){
  var user;
  return {
    setUser: function(input){
      user = input;
    },
    getUser: function(){
      return user;
    },
    showRSS: function(user, cb){
      $http({method: 'GET', url: '/rss', params: {'user':user}}).success(function(data){
        cb(data);
      });
    }
  };
}]);