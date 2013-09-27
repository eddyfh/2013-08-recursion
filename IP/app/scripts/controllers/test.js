'use strict';

angular.module('angyeoApp.testApp')
  .controller('TestCtrl', ['$scope', '$http', function ($scope, $http) {

  }];
  $scope.testthing = function(input){
    console.log(input);
    return input;
  };
  $scope.showfunc = function(){
    return false;
  };

);
