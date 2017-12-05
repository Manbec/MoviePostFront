'use strict';
var moviepostfooter = angular.module('moviepost.footer', []);

moviepostfooter.controller('FooterController', ['$scope', function ($scope) {
    
}]);

moviepostfooter.directive('mpfooter', ['EnvironmentConfig', function (EnvironmentConfig) {

    return {
        templateUrl: EnvironmentConfig.views+'components/footer/footer.html',
        restrict: 'E',
        controller: 'FooterController',
        controllerAs: 'mpfooter'
    }

}]);