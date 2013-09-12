'use strict';

angular.module('angyeoApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/auth/facebook', {
        templateUrl: 'views/fb.html',
        controller: 'FbCtrl'
      })
      .otherwise({
        redirectTo: '/asdf'
      });
  });
