'use strict';
var moviepost = angular.module('moviepost.main', []);

moviepost.config(['$routeProvider', 'EnvironmentConfig', function ($routeProvider, EnvironmentConfig) {

    $routeProvider.when("/", {
      templateUrl: EnvironmentConfig.views + 'views/main/main.html',
      controller: 'MainCtrl'
    });

}]);

moviepost.controller('MainCtrl', ['$scope', '$http' , function ($scope, $http) {
  
  // Popular movies docs: https://developers.themoviedb.org/3/movies/get-popular-movies
  // Basic request: https://api.themoviedb.org/3/movie/550?api_key=dc58753025de257fbcecfef595460d03

  $scope.popularMoviesUrl = "https://api.themoviedb.org/3/movie/popular";

}]);