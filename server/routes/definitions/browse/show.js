'use strict';

var Browse = require('../../../models/browse');

module.exports = {
  handler: function(request, reply){
    var counties = ['Bradley County','Chester County','Claiborne County','Crockett County','Decatur County','Dekalb County','Fentress County','Grainger County','Hancock County','Houston County','Jefferson County','Johnson County','Macon County','McNairy County','Meigs County County','Morgan County','Obion County','Overton County','Pickett County','Polk County','Rhea County','Stewart County','Union County','Warren County','Wayne County','Weakley County','White County'];
    console.log(request.payload.url);
    Browse.show(request.payload.url, function(err, home){
      Browse.encode(home.img, function(err, img){
        home.img = img;
        for(var i = 0; i < counties.length; i++){
          if(home.county === counties[i]){
            home.dry = 'This is in a dry county!';
          }
        }
        reply(home);
      });
    });
  }
};
