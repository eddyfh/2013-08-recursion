'use strict';
FIX SO THAT ONLY ADDS COMPANIES IN ONE PLACE
angular.module('angyeoApp')
  .controller('MainCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
    $scope.query = false;
    $scope.follow = [];
    $scope.queried = false;
    $scope.tweets = [];
    $scope.user;
    $scope.showDescription = false;
    $scope.showFollowing = false;
    $scope.companyList=[];
    // Save the company list into scope
    // TURN THIS INTO A SERVICE
    $http.get('/getCompanyList').success(function(data){
      // console.log('got company list');
      // console.log(data);
      for (var key in data){
        $scope.companyList.push(key);
      }
    });
    // Retrieves logged in user's data and saves to $scope.user
    $http.get('/loggedin').success(function(user){
      $scope.user = user;
      // TWITTER
      // $http({method: 'GET', url: '/startTwitter', params: [$scope.user.following]}).success(function(user){
      // }); 
      $scope.showRSS();
      //RSS Feed
      // $http.get('/rss').success(function(feedData){
      //   $scope.rssData = feedData;
      // });
      if ($scope.user.following){
        for (var key in $scope.user.following) {
          $scope.follow.push(key);
        } 
      }
    });

    $scope.logout = function(){
      $http.post('/logout');
    };

    // TWITTERSTREAM - this only works for 1 user right now
    // var socket = io.connect('http://localhost');
    // socket.on('twitter', function (data) {
    //   $scope.tweets = data;
    //   $scope.$apply();
    //   // socket.emit('my other event', { my: 'data' });
    // });

    $scope.showRSS = function(){
      $http({method: 'GET', url: '/rss', params: [$scope.user]}).success(function(data){
        console.log('running ShowRSS');
        $scope.rssData = data;
      });
    };
    $scope.postClick = function(){
      if ($scope.showDescription === false){
        $scope.showDescription = true;
      } else {
        $scope.showDescription = false;
      }
    };
    $scope.saveEmail = function(email){
      $http({method: 'POST', url: '/emailsubmit', params: [email, $scope.user]}).success(function(){
        console.log('successfully posted');
      });
    };
    $scope.showFollowingToggle = function(){
      $scope.showFollowing = !$scope.showFollowing;
    };
    $scope.selectedCo = undefined;
    // RSS TEST
    // socket.on('rssFeed', function(data){
    //   $scope.rssData = data;
    //   $scope.$apply();
    // });

    $scope.userSubmit = function(query){ // THESE TWO SHOULD BE COMBINED INTO 1 REQUEST
      // $http({method: 'GET', url: '/api', params: [query]}).success(function(postdata){
      //   $scope.numPosts = postdata['num_posts'];
      // });
      $http({method: 'GET', url: '/api/crunchbase/profile', params: [query]}).success(function(data){
        // console.log('data received ',data);
        $scope.query = data;
    }).error(function(data, status){
        console.log('ERROR!');
      });

    };

    
    $scope.userFollow = function(name){
      $scope.follow.push(name);
      $http({method: 'POST', url: '/followPost', params: [name, $scope.user.userId]}).success(function(){
        // console.log('added to DB');
      });
    };

    $scope.authenticated = function(user){
      console.log(user);
      return user;
    };
}])
.controller('ModalDemoCtrl', ['$scope', '$http', '$modal', function($scope, $http, $modal){
  $scope.items = ['item1', 'item2', 'item3'];
  
  $scope.userSubmit = function(query){ // THESE TWO SHOULD BE COMBINED INTO 1 REQUEST
      $http({method: 'GET', url: '/api/crunchbase/profile', params: [query]}).success(function(data){
        $scope.query = data;
    }).error(function(data, status){
        console.log('ERROR!');
      });

    };

  $scope.open = function () {
    console.log('SCOPE OPEN CALLED');
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])
.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
  $scope.items = items; // delete this
  $scope.companyList = [];
  $scope.follow = [];
  $scope.user;
  $http.get('/loggedin').success(function(user){
      $scope.user = user;
    });
  $scope.tempSave = function(company){
    $scope.follow.push(company);
    console.log($scope.follow);
  };
  $scope.ok = function(){
      $http({method: 'POST', url: '/followPost', params: [$scope.follow, $scope.user.userId]}).success(function(){
        console.log('added to DB');
        $modalInstance.close($scope.selected.item);
      });
    };
  $scope.removeTemp = function(company){
    console.log('removeTemp');
    for (var i = 0; i < $scope.follow.length; i++){
      if ($scope.follow[i] === company){
        $scope.follow.splice(i,1);
      }
    }
    console.log($scope.follow);
  };
  $http.get('/getCompanyList').success(function(data){
      console.log('got company list');
      // console.log(data);
      for (var key in data){
        $scope.companyList.push(key);
      }
    });
  $scope.selected = {
    item: $scope.items[0]
  };

  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  // };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
    // $scope.twitterStream = function(){
    // };
    
  // }])
  // .controller('TestCtrl', ['$scope', '$http', function($scope, $http){
  //   $scope.testthing = function(input){
  //     console.log(input);
  //     return input;
  //   };
  //   $scope.showfunc = function(){
  //     return false;
  //   };
  // }])
  // .factory('UserService', [function(){
  //   var userObj = {
  //     isLogged: false,
  //     username: ''
  //   };
  // .controller('NewCtrl', ['$scope', function($scope){}
  //   $scope.testData;
  // ]);

    // $scope.checkPosts = function(name){
    //   $http({
    //   method: 'JSONP',
    //   url: 'http://api.crunchbase.com/v/1/companies/posts?name=Google&api_key=a72hgev95qzstgam5aukbeqe&callback=JSON_CALLBACK'
    // }).success(function(data){
    //     console.log(data);
    // }).error(function(data, status){
    //   console.log(data);
    //     console.log('ERROR!');
    //   });
    // };