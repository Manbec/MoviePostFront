'use strict';
var moviepost = angular.module('moviepost.navbar', []);
moviepost.directive('mpnavbar', ['EnvironmentConfig', function (EnvironmentConfig) {
    return {
        templateUrl: EnvironmentConfig.views + 'components/navbar/navbar.html',
        restrict: 'E',
        controller: 'NavbarController',
        controllerAs: 'mpnavbar'
    }
}]);
moviepost.controller('NavbarController', ['$rootScope', '$scope', '$location', '$http', 'EnvironmentConfig', function ($rootScope, $scope, $location, $http, EnvironmentConfig) {

    $scope.logout = function () {
        sessionStorage.removeItem('Authorization');
        $rootScope.user = undefined;
    }

    $scope.hideLogin = function () {
        return $location.url().indexOf("/login") >= 0 || $rootScope.loggedIn();
    }

    $scope.hideMyMovies = function () {
        return $location.url().indexOf("/mymovies") >= 0;
    }

    angular.element(document).ready(function () {
        if (sessionStorage.getItem('Authorization') && !$rootScope.userProfile) {
            $scope.fetchUserProfile(sessionStorage.getItem('Authorization'));
        }
    });

    $scope.goToSearch = function () {
        if ($scope.searchTerm) {
            $location.path("/search/"+$scope.searchTerm);
            $scope.$apply();
        }
    }


    /*
     *  User data
     * 
     *  @params token string
     */

    $scope.fetchUserProfile = function (token) {
        if (!token) {
            return;
        }
        $http({
            method: 'GET',
            url: EnvironmentConfig.api + '/user',
            headers: {
                'Authorization': token
            },
            ignoreDuplicateRequest: false,
            rejectDuplicateRequest: true,
            requestId: 'fetch-user-profile'
        }).then(function successCallback(response) {

            /*console.log("User Profile");
            console.log(response.data);*/
            $rootScope.user = response.data;

        }, function errorCallback(response) {

            /*console.log("Error User Profile");
            console.log(response.data);*/
            if (response.status != 400) {
                Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
            }
        });
    }

}]);
