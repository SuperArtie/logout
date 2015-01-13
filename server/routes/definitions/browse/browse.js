'use strict';

var Browse = require('../../../models/browse');

module.exports = {
  auth: false,
  handler: function(request, reply){
    Browse.browse(request.payload.zip, function(err, links){
      reply(links);
    });
  }
};
