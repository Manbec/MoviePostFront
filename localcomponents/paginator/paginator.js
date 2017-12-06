'use strict';
var moviepost = angular.module('moviepost.paginator', []);
moviepost.directive('mppaginator', ['$http', 'EnvironmentConfig', function ($http, EnvironmentConfig) {
   
    var link = function (scope, elem, attrs) {
        // Data display variables
        scope.dataDict = {}; // Movies are storesd for faster acces purpose
        scope.page = 1; // Current page that is being requested/loaded/displayed
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
                },
                ignoreDuplicateRequest: true,
                rejectDuplicateRequest: true,
                requestId: 'fetch-paginator-data'

            }).then(function successCallback(response) {

                console.log("Movies");
                console.log(response.data);
                scope.loading = false;

                scope.total_results = response.data.total_results;
                scope.total_pages = response.data.total_pages;
                scope.dataDict[scope.page] = response.data.results;
                /*console.log("dict");
                console.log(scope.dataDict);*/
                
            }, function errorCallback(response) {

                /*console.log("Error LoadMovies");
                console.log(response.data);*/
                Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
            });

        }

        scope.$watch('page', function(){
            window.scrollTo(0, 0);
            if(!scope.dataDict[scope.page]){
                scope.loadResults();
            }
        });

        scope.firstPage = function() {
            scope.page = 1;
        }

        scope.prevPage = function() {
            if(scope.page > 1){
                scope.page -= 1;
            }
        }

        scope.toPage = function(pageNumber) {
            if(pageNumber > 0 && pageNumber < scope.total_pages){
                scope.page = pageNumber
            }
        }

        scope.nextPage = function() {
            if(scope.page < scope.total_pages){
                scope.page += 1;
            }
        }
        scope.lastPage = function() {
            console.log(scope.total_pages);
            scope.page = scope.total_pages;
        }

        scope.availablePageNumbers = function() {
            var smallestPrev = scope.page-4;
            smallestPrev = smallestPrev < 1 ? 1 : smallestPrev;
            var biggestNext = scope.page+4;
            biggestNext = biggestNext > scope.total_pages ? scope.total_pages : biggestNext;

            var pagesNumbers = []
            for(var i = smallestPrev; i <= biggestNext; i++){
                pagesNumbers.push(i);
            }
            return pagesNumbers;
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
        
        scope.imageUrl = function(data){
            return scope.apiConfig.images.secure_base_url+scope.apiConfig.images.poster_sizes[2]+data.poster_path;
        }

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