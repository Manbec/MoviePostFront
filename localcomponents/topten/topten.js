'use strict';
var moviepost = angular.module('moviepost.topten', []);
moviepost.directive('mptopten', ['EnvironmentConfig', function (EnvironmentConfig) {
    return {
        templateUrl: EnvironmentConfig.views + 'components/topten/topten.html',
        restrict: 'E',
        controller: 'TopTenController',
        controllerAs: 'mptopen'
    }
}]);
moviepost.controller('TopTenController', ['$scope', '$location', 'EnvironmentConfig', function ($scope, $location, EnvironmentConfig) {

    $scope.floatSelf = false;
    $scope.scrollReached = function () {
        
        var topTenFrame = document.getElementById('topten-frame');
        if(!topTenFrame){
            window.removeEventListener("scroll", $scope.scrollReached);
            return;
        }
        
        var topTenPositionY = topTenFrame.offsetTop;
        var windowScrolledY = window.pageYOffset;
        
        if ($scope.floatSelf != (windowScrolledY >= topTenPositionY)) {
            $scope.floatSelf = windowScrolledY >= topTenPositionY;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
        
    }

    window.addEventListener("scroll", $scope.scrollReached);

}]);
