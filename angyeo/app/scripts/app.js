'use strict';

var crunchlApp = angular.module('angyeoApp', [])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          $timeout(deferred.resolve, 0);

        // Not Authenticated
        else {
          // $rootScope.message = 'You need to log in.';
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
        , resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.ejs'
      })
      // .when('/_=_', {
      //   templateUrl: 'views/test.ejs',
        // controller: 'FbCtrl'
      // })
    //   .when('/success', {
    //     templateUrl: 'views/fb.html',
    //     controller: 'FbCtrl'
    //   })
      .otherwise({
        redirectTo: '/catchallurl'
      });

  });
