'use strict';
var moviepost = angular.module('moviepost.navbar', []);
moviepost.directive('mpnavbar', ['EnvironmentConfig', function (EnvironmentConfig) {
    return {
        templateUrl: EnvironmentConfig.views+'components/navbar/navbar.html',
        restrict: 'E',
        controller: 'NavbarController',
        controllerAs: 'mpnavbar'
    }
}]);
moviepost.controller('NavbarController', ['$rootScope', '$scope', '$location', 'EnvironmentConfig', function ($rootScope, $scope, $location, EnvironmentConfig) {
    
    $scope.logOutMoviePost = function () {
        
        window.location.href = "http://" + EnvironmentConfig.appdomain + "/logout";

    }
    
    $scope.hideLogin = function(){
        return $location.url().indexOf("/login") >=0 || $rootScope.loggedIn();
    }

}]);
