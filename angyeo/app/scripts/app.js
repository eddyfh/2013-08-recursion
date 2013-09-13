'use strict';

angular.module('angyeoApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/success', {
        templateUrl: 'views/fb.html',
        controller: 'FbCtrl'
      })
      .otherwise({
        redirectTo: '/asdf'
      });
  });
