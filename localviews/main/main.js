'use strict';
var moviepost = angular.module('moviepost.main', []);

moviepost.config(['$routeProvider', 'EnvironmentConfig', function ($routeProvider, EnvironmentConfig) {

  $routeProvider.when("/", {
    templateUrl: EnvironmentConfig.views + 'views/main/main.html',
    controller: 'MainCtrl'
  });

}]);

moviepost.controller('MainCtrl', ['$scope', '$http', 'EnvironmentConfig', function ($scope, $http, EnvironmentConfig) {

  // Popular movies docs: https://developers.themoviedb.org/3/movies/get-popular-movies
  // Basic request: https://api.themoviedb.org/3/movie/550?api_key=dc58753025de257fbcecfef595460d03

  $scope.popularMoviesUrl = "https://api.themoviedb.org/3/movie/popular";
  $scope.userFavoritesUrl = EnvironmentConfig.api + '/user/movies';
  $scope.authToken = sessionStorage.getItem('Authorization');

  $scope.saveFavoriteMovie = function (movie) {
    
    if (!$scope.authToken) {
      var $toastContent = $('<span>Log In to Save!</span>').add($('<a class="btn-flat toast-action" href="/login">Go</a>'));
      Materialize.toast($toastContent, 2000);
      return;
    }

    $http({
      method: 'PUT',
      url: EnvironmentConfig.api + '/user/movies',
      data: {
        movie: movie
      },
      headers: {
        'Authorization': $scope.authToken
      },
      ignoreDuplicateRequest: false,
      rejectDuplicateRequest: true,
      requestId: 'save-favorite'
    }).then(function successCallback(response) {

      /*console.log("Save Fav Response");
      console.log(response.data);*/

    }, function errorCallback(response) {

      console.log("Save Fav Error");
      console.log(response.data);

      if (response.status != 400) {
        Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
      }

    });
  }

  $scope.deleteFavoriteMovie = function (movie) {
    $http({
      method: 'DELETE',
      url: EnvironmentConfig.api + '/user/movies/'+movie.id,
      headers: {
        'Authorization': $scope.authToken
      },
      ignoreDuplicateRequest: false,
      rejectDuplicateRequest: true,
      requestId: 'save-favorite'
    }).then(function successCallback(response) {

      /*console.log("Remove Fav Response");
      console.log(response.data);*/

    }, function errorCallback(response) {

      /*console.log("Remove Fav Error");
      console.log(response.data);*/

      if (response.status != 400) {
        Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
      }

    });
  }

}]);