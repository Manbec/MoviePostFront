'use strict';
var moviepost = angular.module('moviepost.paginator', []);
moviepost.directive('mppaginator', ['$http', 'EnvironmentConfig', function ($http, EnvironmentConfig) {

    var link = function (scope, elem, attrs) {
        // Data display variables
        scope.dataDict = {}; // Movies are storesd for faster acces purpose
        scope.favoriteData = []; // data of bookmarked elements
        scope.page = 1; // Current page that is being requested/loaded/displayed
        scope.total_results = -1;
        scope.total_pages = -1;

        // Loading controls
        scope.loading = true;

        // Localization options
        if (!scope.language) {
            scope.language = 'en-US'
        }

        /* 
         * Requests
         * 
         */

        scope.loadResults = function () {
            var request = {
                method: 'GET',
                url: scope.apiUrl,
                params: {
                    api_key: scope.apiKey,
                    language: scope.language,
                    page: scope.page
                },
                ignoreDuplicateRequest: false,
                rejectDuplicateRequest: true,
                requestId: 'fetch-paginator-data'
            }
            if (scope.authToken) {
                request.headers = { 'Authorization': scope.authToken }
            }
            if (scope.query) {
                request.params.query = scope.query
            }
            $http(request).then(function successCallback(response) {

                /*console.log("Movies");
                console.log(response.data);*/
                scope.loading = false;

                scope.total_results = response.data.total_results;
                scope.total_pages = response.data.total_pages;
                scope.dataDict[scope.page] = response.data.results;
                /*console.log("dict");
                console.log(scope.dataDict);*/

            }, function errorCallback(response) {

                /*console.log("Error LoadMovies");
                console.log(response.data);*/
                if (response.status != 400) {
                    Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
                }

            });
        }

        scope.loadFavorites = function () {
            if (scope.favoritesApiUrl) {
                var request = {
                    method: 'GET',
                    url: scope.favoritesApiUrl,
                    ignoreDuplicateRequest: false,
                    rejectDuplicateRequest: true,
                    requestId: 'fetch-paginator-favoritedata'
                }
                if (scope.favoritesAuthToken) {
                    request.headers = { 'Authorization': scope.favoritesAuthToken }
                }
                $http(request)
                    .then(function successCallback(response) {
                       /*console.log("Fav Movies");
                        console.log(response.data);*/
                        scope.favoriteData = response.data;
                        if (!scope.$$phase) {
                            scope.$apply();
                        }

                    }, function errorCallback(response) {

                        /*console.log("Error Load Fav Movies");
                        console.log(response.data);*/
                        if (response.status != 400) {
                            Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
                        }

                    });
            }
        }

        /* 
         * Navigator behaviour
         * 
         */

        scope.$watch('page', function () {
            window.scrollTo(0, 0);
            if (!scope.dataDict[scope.page]) {
                scope.loadResults();
            }
        });

        scope.firstPage = function () {
            scope.page = 1;
        }

        scope.prevPage = function () {
            if (scope.page > 1) {
                scope.page -= 1;
            }
        }

        scope.toPage = function (pageNumber) {
            if (pageNumber > 0 && pageNumber <= scope.total_pages) {
                scope.page = pageNumber
            }
        }

        scope.nextPage = function () {
            if (scope.page < scope.total_pages) {
                scope.page += 1;
            }
        }
        scope.lastPage = function () {
            console.log(scope.total_pages);
            scope.page = scope.total_pages;
        }

        scope.availablePageNumbers = function () {
            var smallestPrev = scope.page - 4;
            smallestPrev = smallestPrev < 1 ? 1 : smallestPrev;
            var biggestNext = scope.page + 4;
            biggestNext = biggestNext > scope.total_pages ? scope.total_pages : biggestNext;

            var pagesNumbers = []
            for (var i = smallestPrev; i <= biggestNext; i++) {
                pagesNumbers.push(i);
            }
            return pagesNumbers;
        }

        /* 
         * First setup
         * 
         */

        angular.element(document).ready(function () {
            if (scope.apiConfig) {
                scope.loadFavorites();
                scope.loadResults();
            }
        });

        scope.$watch('apiConfig', function () {
            if (scope.total_results == -1) {
                scope.loadFavorites();
                scope.loadResults();
            }
        })

        /* 
         * Favorites behaviour
         * 
         */

        scope.imageUrl = function (data) {
            if (!scope.apiConfig) {
                return "";
            }
            return scope.apiConfig.images.secure_base_url + scope.apiConfig.images.poster_sizes[2] + data.poster_path;
        }

        scope.favoriteIndex = function (data) {
            if (scope.favoriteData.length == 0) {
                return -1;
            }
            else {
                for (var i = 0; i < scope.favoriteData.length; i++) {
                    if(data.idmovie){
                        if (data.idmovie === scope.favoriteData[i].idmovie) {
                            return i;
                        }
                    }
                    else {
                        if (data.id === scope.favoriteData[i].idmovie) {
                            return i;
                        }
                    }
                }
                return -1;
            }
        }

        scope.isFavoriteUrl = function (data) {
            return scope.favoriteIndex(data) > -1 ? "images/favorite/filled_red100.png" : "images/favorite/empty_black100.png";
        }

        scope.favoriteAction = function (data) {
            if (scope.favoriteIndex(data) > -1) {
                scope.deleteFavorite(data);
            }
            else {
                scope.saveFavorite(data);
            }
        }

        scope.saveFavorite = function (data) {
            if(!data.idmovie){
                data.idmovie = data.id;
            }
            if(!data.id){
                data.id = data.idmovie;
            }
            scope.favoriteData.push(data);
            scope.saveFavoriteFunc(data);
            if (!scope.$$phase) {
                scope.$apply();
            }
        }

        scope.deleteFavorite = function (data) {
            if(!data.idmovie){
                data.idmovie = data.id;
            }
            if(!data.id){
                data.id = data.idmovie;
            }
            var indexToRemove = scope.favoriteIndex(data);
            console.log("delete" +indexToRemove);
            scope.favoriteData.splice(indexToRemove, 1);

            scope.deleteFavoriteFunc(data);
            if (!scope.$$phase) {
                scope.$apply();
            }

        }

    }

    /*
        apiUrl: '=?', // api URL To Load Main Data
        apiKey: '=?', // apiKey To Pemit Load Main Data (Can be ignored)
        authToken: '=?', // If needed for fetching data
        favoritesApiUrl: '=?', // api URL To Load Favorites for comparison
        favoritesApiKey: '=?', // api Key To Permit Favorites for comparison (Can be ignored)
        favoritesAuthToken: '=?', // if favorites api requires authentication
        query: '=?', // if search will be done
        apiConfig: '=?', // Api configuration for requests for main data
        data: '=?', // Pass the data directly and not use ajax requests
        language: '=?', // Localization of data
        saveFavoriteFunc: '=' // Reference to setting a favorite (In the future it could be ignored to set favorite item functionality as optional)
        saveFavoriteFunc: '=' // Reference to deleting a favorite (In the future it could be ignored to set favorite item functionality as optional)
    */

    var moviepost = {
        restrict: 'E',
        transclude: true,
        replace: false,
        templateUrl: EnvironmentConfig.views + 'components/paginator/paginator.html',
        scope: {
            apiUrl: '=?',
            apiKey: '=?',
            authToken: '=?',
            favoritesApiUrl: '=?',
            favoritesApiKey: '=?',
            favoritesAuthToken: '=?',
            query: '=?',
            apiConfig: '=?',
            data: '=?',
            language: '=?',
            saveFavoriteFunc: '=',
            deleteFavoriteFunc: '='
        },
        link: link
    }

    return moviepost;

}]);