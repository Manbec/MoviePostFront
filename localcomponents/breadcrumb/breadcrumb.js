'use strict';
var moviepost = angular.module('moviepost.breadcrumb', []);
moviepost.directive('mpbreadcrumb', ['EnvironmentConfig', function (EnvironmentConfig) {
    return {
        templateUrl: EnvironmentConfig.views+'components/breadcrumb/breadcrumb.html',
        restrict: 'E',
        controller: 'BreadcrumbController',
        controllerAs: 'mpbreadcrumb'
    }
}]);
moviepost.controller('BreadcrumbController', ['$scope', '$location', 'EnvironmentConfig', function ($scope, $location, EnvironmentConfig) {
    
    var locations = $location.url().split("/");
    $scope.navLocations = locations.filter(function (location) {
        return location.length > 0;
    });
    console.log($scope.navLocations);

    // Go to location link on a different depth

    $scope.toLocation = function(index){
        var location = ""
        for (var i = 0; i < $scope.navLocations; i++){
            location += "/" + $scope.navLocations[i];
        }
        $location.path(location);
    }

}]);
