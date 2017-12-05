'use strict';
var moviepost = angular.module('moviepost.main', []);

moviepost.config(['$routeProvider', 'EnvironmentConfig', function ($routeProvider, EnvironmentConfig) {

    $routeProvider.when("/", {
      templateUrl: EnvironmentConfig.views + 'views/main/main.html',
      controller: 'MainCtrl'
    });

}]);

moviepost.controller('MainCtrl', ['$scope', '$http' , function ($scope, $http) {
  
  $scope.popularMoviesUrl = "https://api.themoviedb.org/3/movie/popular";

}]);