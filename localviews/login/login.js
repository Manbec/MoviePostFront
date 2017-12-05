'use strict';
var moviepost = angular.module('moviepost.login', []);

moviepost.config(['$routeProvider', '$locationProvider', 'EnvironmentConfig', function ($routeProvider, $locationProvider, EnvironmentConfig) {

  $routeProvider.when("/login/", {
    templateUrl: EnvironmentConfig.views + 'views/login/login.html',
    controller: 'LoginCtrl'
  });

}]);

moviepost.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$location', '$filter', 'EnvironmentConfig', function ($rootScope, $scope, $http, $location, $filter, EnvironmentConfig) {

  $scope.accessType = "login";

  angular.element(document).ready(function () {
      if (sessionStorage.getItem('Authorization')) {
        $location.path("/");
        $scope.$apply();
      }
  });

  $scope.doLogin = function () {
    // LOGIN FUNCTION HERE
    
  }

  $scope.toggleAccessType = function(){
    $scope.accessType = $scope.accessType == "login" ? "signup" : "login";
  }

  $scope.isSignUp = function(){
    return $scope.accessType == "signup";
  }

}]);