'use strict';

var crunchlApp = angular.module('angyeoApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/asdf', {
        templateUrl: 'views/test.ejs',
        controller: 'TestCtrl'
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
