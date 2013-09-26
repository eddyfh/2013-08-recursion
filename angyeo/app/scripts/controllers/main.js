'use strict';
angular.module('angyeoApp')
  .controller('MainCtrl', ['$scope', 'sharedServices', '$http', '$modal', '$timeout', function ($scope, sharedServices, $http, $modal, $timeout) {
    $scope.query = false;
    $scope.queried = false;
    $scope.tweets = [];
    $scope.user;
    $scope.showDescription = {};
    $scope.showFollowing = false;
    $scope.companyList=[];
    // TURN THIS INTO A SERVICE?
    $http.get('/getCompanyList').success(function(data){
      for (var key in data){
        $scope.companyList.push(key);
      }
    });

    // should figure out how to move fetchprofiles somewhere else
    $scope.fetchProfiles = function(){
    console.log('running fetchProfiles');
    $http({method: 'GET', url: '/api/crunchbase/profile', params: {'companies': $scope.user.following}}).success(function(data){
      $scope.companyProfilesData = data;
      console.log($scope.companyProfilesData);
      // Function finds CEO/founders, save to companyProfilesData.employees as [name, title]
      for (var i = 0; i < $scope.companyProfilesData.length; i++){ // each company
        var people = $scope.companyProfilesData[i].relationships;
        $scope.companyProfilesData[i].employees=[];
        for (var j = 0; j < people.length;j++){//each rel'p
          // need to fix below to ignore commas, etc
          if (people[j].title.toLowerCase().indexOf('ceo') !== -1 || people[j].title.toLowerCase().indexOf('founder') !== -1){
            var person = people[j].person.first_name+' '+people[j].person.last_name;
            $scope.companyProfilesData[i].employees.push([person, people[j].title]);
          }
          // var titleWords = people[j].title.replace(/,|\./g,'').split(' ');
          // for (var k = 0; k < titleWords.length; k++){ // each word in title
          //   if (titleWords[k].toLowerCase() === 'ceo' || titleWords[k].toLowerCase() === 'founder' || titleWords[k].toLowerCase() === 'co-founder'){
          //     var person = people[j].person.first_name+' '+people[j].person.last_name;
          //     $scope.companyProfilesData[i].employees.push([person, people[j].title]);
          //   }
          // } // title close
        } // person close
        console.log($scope.companyProfilesData[i].employees);
      } // company close
      }).error(function(data, status){
          console.log('ERROR!');
        });
    };

    // Retrieves logged in user's data and saves to $scope.user
    $http.get('/loggedin').success(function(user){
      $scope.user = user;
      sharedServices.setUser($scope.user);
      sharedServices.showRSS($scope.user, function(data){
        $scope.rssData = data;
      });
      $scope.fetchProfiles();
      // TWITTER
      // $http({method: 'GET', url: '/startTwitter', params: [$scope.user.following]}).success(function(user){
      // });
    });
    $scope.localRSS = function(){
      console.log('SHOW RSS RUNING');
    };
// TURN BACK ON
    // setInterval(function(){
    //     $scope.$apply(function() {
    //       sharedServices.showRSS($scope.user, function(data){
    //         $scope.rssData = data;
    //       });
    //     });
    // }, 5000);

    // setInterval(function(){
    //   $scope.$apply(function(){
    //     sharedServices.showRSS($scope.user, function(data){
    //       $scope.rssData = data;
    //     });
    //   }, 15000);
    // });

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

    $scope.postClick = function(index){
      if ($scope.showDescription[index] === true){
        $scope.showDescription[index] = false;
      } else {
        $scope.showDescription[index]= true;
      }
    };
    $scope.checkDescription = function(index){
      if ($scope.showDescription[index]){
        return true;
      } else {
        return false;
      }
    };
    $scope.companyProfilesData = [];

      // $scope.fetchProfiles();
    // $scope.showFollowingToggle = function(){
    //   $scope.showFollowing = !$scope.showFollowing;
    // };
    // $scope.selectedCo = undefined;
    // RSS TEST
    // socket.on('rssFeed', function(data){
    //   $scope.rssData = data;
    //   $scope.$apply();
    // });


    // $scope.userSubmit = function(query){ // THESE TWO SHOULD BE COMBINED INTO 1 REQUEST
    //   // $http({method: 'GET', url: '/api', params: [query]}).success(function(postdata){
    //   //   $scope.numPosts = postdata['num_posts'];
    //   // });
    //   $http({method: 'GET', url: '/api/crunchbase/profile', params: [query]}).success(function(data){
    //     // console.log('data received ',data);
    //     $scope.query = data;
    // }).error(function(data, status){
    //     console.log('ERROR!');
    //   });

    // };

    
    // $scope.userFollow = function(name){
    //   $scope.follow.push(name);
    //   $http({method: 'POST', url: '/followPost', params: [name, $scope.user.userId]}).success(function(){
    //     // console.log('added to DB');
    //   });
    // };

    $scope.authenticated = function(user){
      console.log(user);
      return user;
    };
  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        modalClose: function(){
          $scope.localRSS();
        }
      }
    });
  };
}])
.controller('ModalDemoCtrl', ['$scope', '$http', '$modal', function($scope, $http, $modal){


    // modalInstance.result.then(function (selectedItem) {
    //   $scope.selected = selectedItem;
    // }, function () {
    //   // $log.info('Modal dismissed at: ' + new Date());
    // });
}])
.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$http', 'sharedServices', 'modalClose', function ($scope, $modalInstance, $http, sharedServices, modalClose) {
  $scope.companyList = [];
  $scope.user = sharedServices.getUser();
  $scope.user.following = $scope.user.following || [];
  $scope.tempSave = function(company){
    $scope.user.following.push(company);
    // console.log($scope.user.following);
  };
  $scope.ok = function(email){
    if (email){
      $scope.user.email = email;
    }
    $http({method: 'POST', url: '/followPost', params: {'user': $scope.user}}).success(function(){
      console.log('added to DB');
    });
    sharedServices.setUser($scope.user);
    modalClose = true;
    $modalInstance.close();
  };
  $scope.removeTemp = function(company){
    for (var i = 0; i < $scope.user.following.length; i++){
      if ($scope.user.following[i] === company){
        $scope.user.following.splice(i,1);
      }
    }
    // console.log($scope.user.following);
  };
  $scope.saveEmail = function(email){
    $http({method: 'POST', url: '/emailsubmit', params: [email, $scope.user]}).success(function(){
      console.log('successfully posted');
    });
  };
  $http.get('/getCompanyList').success(function(data){
      console.log('got company list');
      // console.log(data);
      for (var key in data){
        $scope.companyList.push(key);
      }
    });
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