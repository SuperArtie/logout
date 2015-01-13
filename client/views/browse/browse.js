(function(){
  'use strict';

  angular.module('hapi-auth')
    .controller('BrowseCtrl', ['$scope', 'Browse', function($scope, Browse){
      var geocoder = new google.maps.Geocoder();
      $scope.positions = [];
      Browse.locate().then(function(position){
        console.log(position);
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.positions.push({lat: pos.k,lng: pos.D});
        console.log(pos);
        $scope.map.setCenter(pos);
      });
      $scope.$on('mapInitialized', function(event, map){
        $scope.map = map;
      });
      Browse.browse().then(function(response){
        console.log(response.data);
        response.data.forEach(codeAddress);
      });
      function codeAddress(address){
        geocoder.geocode({'address': address.addr}, function(results, status){
          if(status === google.maps.GeocoderStatus.OK){
            var icon = 'assets/icon.png',
                marker = new google.maps.Marker({icon:icon, animation:google.maps.Animation.DROP});
            marker.setPosition(results[0].geometry.location);
            marker.setMap($scope.map);
          }else{
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    }]);
})();
