'use strict';
var moviepost = angular.module('moviepost.paginator', []);
moviepost.directive('mppaginator', ['$http', 'EnvironmentConfig', function ($http, EnvironmentConfig) {
   
    var link = function (scope, elem, attrs) {
        // Data display variables
        scope.dataDict = {};
        scope.page = 1;
        scope.total_results = -1;
        scope.total_pages = -1;

        // Loading controls
        scope.loading = true;

        // Localization options
        if (!scope.language) {
            scope.language = 'en-US'
        }

        scope.loadResults = function () {

            $http({

                method: 'GET',
                url: scope.apiUrl,
                params: {
                    api_key: scope.apiKey,
                    language: scope.language,
                    page: scope.page
                }

            }).then(function successCallback(response) {

                /*console.log("Movies");
                console.log(response.data);*/
                scope.loading = false;

                scope.total_results = response.data.total_results;
                scope.total_pages = response.data.total_pages;
                scope.dataDict[scope.page] = response.data.results;
                /*console.log("dict");
                console.log(scope.dataDict);*/
                console.log(scope.page < scope.total_pages);
                
            }, function errorCallback(response) {

                /*console.log("Error LoadMovies");
                console.log(response.data);*/
                Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
            });

        }

        scope.$watch('page', scope.pageChange);
        scope.pageChange = function(){
            
        }

        angular.element(document).ready(function () {
            if(scope.apiConfig){
                scope.loadResults();
            }
        });

        scope.$watch('apiConfig', function(){
            if(scope.total_results == -1) {
                scope.loadResults();
            }
        })

    }
    
    var moviepost = {
        restrict: 'E',
        transclude: true,
        replace: false,
        templateUrl: EnvironmentConfig.views + 'components/paginator/paginator.html',
        scope: {
            apiUrl: '=?',
            apiKey: '=?',
            apiConfig: '=?',
            data: '=?',
            language: '=?',
        },
        link: link
    }

    return moviepost;

}]);