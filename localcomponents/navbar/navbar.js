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
moviepost.controller('NavbarController', ['$rootScope', '$scope', '$location', 'EnvironmentConfig', function ($rootScope, $scope, $location, EnvironmentConfig) {

    $scope.logOutMoviePost = function () {

        window.location.href = "http://" + EnvironmentConfig.appdomain + "/logout";

    }

    $scope.hideLogin = function () {
        return $location.url().indexOf("/login") >= 0 || $rootScope.loggedIn();
    }

    angular.element(document).ready(function () {
        if (sessionStorage.getItem('Authorization') && !$rootScope.userProfile) {
            $scope.fetchUserProfile();
        }
    });

    $scope.fetchUserProfile = function () {

        $http({
            method: 'GET',
            url: EnvironmentConfig.api + '/user',
            headers: {
                'Authorization': token
            },
            ignoreDuplicateRequest: true,
            rejectDuplicateRequest: true,
            requestId: 'fetch-user-profile'
        }).then(function successCallback(response) {

            console.log("User Profile");
            console.log(response.data);

        }, function errorCallback(response) {

            /*console.log("Error User Profile");
            console.log(response.data);*/
            Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
        });
    }

}]);
