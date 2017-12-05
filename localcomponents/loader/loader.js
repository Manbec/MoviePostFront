'use strict';
var moviepost = angular.module('moviepost.loader', []);
moviepost.directive('mploader', ['EnvironmentConfig', function (EnvironmentConfig) {

    return {
        restrict: 'E',
        transclude: true,
        replace: false,
        templateUrl: EnvironmentConfig.views + 'components/loader/loader.html',
    }

}]);