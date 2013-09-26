'use strict';

var crunchlApp = angular.module('angyeoApp', ['ui.bootstrap'])
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
        templateUrl: 'views/login.ejs',
        // controller: 'MainCtrl'
      })
      // .when('/userSelections', {
      //   templateUrl: 'views/userSelections.ejs'
      //   // controller: 'ModalDemoCtrl'
      // })
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
      // console.log('user is');
      // console.log(user);
      $http({method: 'GET', url: '/rss', params: {'user':user}}).success(function(data){
        // console.log('running ShowRSS');
        // console.log(data);
        cb(data);
      });
    }
  };
}]);