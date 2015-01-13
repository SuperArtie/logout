'use strict';

var Browse = require('../../../models/browse');

module.exports = {
  handler: function(request, reply){
    Browse.browse(request.payload.zip, function(err, links){
      reply(links);
    });
  }
};
