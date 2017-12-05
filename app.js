'use strict';
var moviepost = angular.module('moviepost',
  ["ngRoute",
    "moviepost.config",
    "moviepost.main",
    "moviepost.login",
    "moviepost.navbar",
    "moviepost.breadcrumb",
    "moviepost.footer",
    "moviepost.loader",
    "moviepost.paginator"
  ]);

moviepost.commons = {}

/*
 *  uniqueRequestsAwareHttpService
 *  
 *  This is a utility that prevents a specific request to be sent multiple 
 *  times without one finishing a previous instance.
 *  Used for databinding-triggered requests to avoid saturation of services.
 * 
 */

moviepost.commons.uniqueRequestsAwareHttpService = function ($delegate, $q) {
  /**
   * Pending requests and local $http var for natural reference
   */
  var pendingRequests = {};
  var $http = $delegate;

  /**
   * Hash generator
   */
  function hash(str) {
    var h = 0;
    var strlen = str.length;
    if (strlen === 0) {
      return h;
    }
    for (var i = 0, n; i < strlen; ++i) {
      n = str.charCodeAt(i);
      h = ((h << 5) - h) + n;
      h = h & h;
    }
    return h >>> 0;
  }

  /**
   * Helper to generate a unique identifier for a request
   */
  function getRequestIdentifier(config) {
    if (config.requestId) {
      return config.requestId;
    }
    var str = config.method + config.url;
    if (config.params && typeof config.params === 'object') {
      str += angular.toJson(config.params);
    }
    if (config.data && typeof config.data === 'object') {
      str += angular.toJson(config.data);
    }
    return hash(str);
  }

  /**
   * Modified $http service
   */
  var $duplicateRequestsFilter = function (config) {

    //Ignore for this request?
    if (config.ignoreDuplicateRequest) {
      return $http(config);
    }

    //Get unique request identifier
    var identifier = getRequestIdentifier(config);

    //Check if such a request is pending already
    if (pendingRequests[identifier]) {
      if (config.rejectDuplicateRequest) {
        return $q.reject({
          data: '',
          headers: {},
          status: config.rejectDuplicateStatusCode || 400,
          config: config
        });
      }
      return pendingRequests[identifier];
    }

    //Create promise using $http and make sure it's reset when resolved
    pendingRequests[identifier] = $http(config).finally(function () {
      delete pendingRequests[identifier];
    });

    //Return promise
    return pendingRequests[identifier];
  };

  //Map rest of methods
  Object.keys($http).filter(function (key) {
    return (typeof $http[key] === 'function');
  }).forEach(function (key) {
    $duplicateRequestsFilter[key] = $http[key];
  });

  //Return it
  return $duplicateRequestsFilter;
};

moviepost.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider, $locationProvider, $httpProvider, $provide) {

  $provide.decorator('$http', ['$delegate', '$q', function ($delegate, $q) {
    return moviepost.commons.uniqueRequestsAwareHttpService($delegate, $q);
  }]);

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  $routeProvider.otherwise({ redirectTo: '/' });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

}]).run(['$rootScope', '$location', '$http', '$routeParams', 'moviesApiKey', function ($rootScope, $location, $http, $routeParams, moviesApiKey) {

  $rootScope.loggedIn = function () {
    return sessionStorage.getItem("Authorization") != undefined;
  }
  $rootScope.moviesApiKey = moviesApiKey;
  console.log("apikey: " + moviesApiKey);

  $rootScope.moviesApiConfig = localStorage.getItem("moviesApiConfig");
  var moviesApiConfigUrl = "https://api.themoviedb.org/3/configuration"
  var downloadAPIConfig = function () {

    $http({
      method: 'GET',
      url: moviesApiConfigUrl,
      params: {
        api_key: $rootScope.moviesApiKey
      }

    }).then(function successCallback(response) {

      console.log("Config");
      //console.log(response.data);
      $rootScope.moviesApiConfig = response.data;
      console.log($rootScope.moviesApiConfig);
      if(!$rootScope.$$phase){
        console.log("apply");
        $rootScope.apply();
      }

    }, function errorCallback(response) {

      Materialize.toast('Error de conexión', 4000) // 4000 is the duration of the toast
    });

  }

  if(!$rootScope.moviesApiConfig){
    downloadAPIConfig()
  }

}]);