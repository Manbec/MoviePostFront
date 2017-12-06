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

  $scope.checkLogin = function () {

    if ($scope.isSignUp()) {
      $scope.doSignUp();
    }
    else {
      $scope.doLogin();
    }
  }

  $scope.doLogin = function () {
    $http({
      method: 'POST',
      url: EnvironmentConfig.api + '/mplogin',
      data: {
        email: $scope.email,
        password: $scope.password
      },
      ignoreDuplicateRequest: false,
      rejectDuplicateRequest: true,
      requestId: 'user-login'
    }).then(function successCallback(response) {

      /*console.log("Login");
      console.log(response.data);*/

      sessionStorage.setItem("Authorization", response.data);
      $location.path("/");
      $scope.$apply();

    }, function errorCallback(response) {

      /*console.log("Login Error");
      console.log(response.data);*/

      if (response.status == 400) {
        Materialize.toast('Incorrect Access', 2000) // 4000 is the duration of the toast
      }
      else {
        Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
      }

    });
  }

  $scope.doSignUp = function () {
    $http({
      method: 'POST',
      url: EnvironmentConfig.api + '/registration',
      data: {
        name: $scope.name,
        email: $scope.email,
        password: $scope.password,
        password_confirmation: $scope.password_confirmation,
      },
      ignoreDuplicateRequest: false,
      rejectDuplicateRequest: true,
      requestId: 'user-register'
    }).then(function successCallback(response) {

      /*console.log("Register");
      console.log(response.data);*/

      sessionStorage.setItem("Authorization", response.data);
      $location.path("/");
      $scope.$apply();

    }, function errorCallback(response) {

      /*console.log("Register Error");
      console.log(response.data);*/

      if (response.status == 400) {
        Materialize.toast('Incomplete Data', 2000) // 4000 is the duration of the toast
      }
      else {
        Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
      }

    });
  }


  $scope.toggleAccessType = function () {
    $scope.accessType = $scope.accessType == "login" ? "signup" : "login";
  }

  $scope.isSignUp = function () {
    return $scope.accessType == "signup";
  }

}]);