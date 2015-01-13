(function(){
  'use strict';

  angular.module('hapi-auth')
  .factory('Browse', ['$q', '$http', function($q, $http){
      function locate(){
        var deferred = $q.defer(),
        options  = {enableHighAccuracy: true, timeout: 10000, maximumAge: 0};

        navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, options);

        return deferred.promise;
      }
      function browse(){
        return $http.get('/browse');
      }
    return {locate:locate, browse:browse};
  }]);
})();
