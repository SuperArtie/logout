'use strict';

var request = require('request'),
    cheerio = require('cheerio'),
    _       = require('underscore'),
    async   = require('async');

function Browse(){}

Browse.browse = function(zip, cb){
  var links = [];
  request('http://www.lakehousevacations.com/search.php?cid=46&s_res=AND&pg=advanced&f_lake_wf=Yes&hw_zip_r=280&hw_zip='+zip, function(error, response, body){
    if(!error && response.statusCode === 200){
      var $ = cheerio.load(body);
      links = $('div[style="width:620px;"][align="left"] td[align="center"] a').map(function(index, link){
        return linkMaker($(link).attr('href'));
      });
      links = _.compact(links);
      links = _.uniq(links);
      async.map(links, getZip, cb);
    }
  });
};

Browse.show = function(url, cb){
  var home = {};
  request(url, function(error, response, body){
    if(!error && response.statusCode === 200) {
      var $ = cheerio.load(body),
          street = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(2)').text().trim(),
          zip = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(3)').text().trim();
      home.rent = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(1)').text().trim();
      home.beds = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(6)').text().trim();
      home.addr = street + ' ' + zip;
      home.county = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(4)').text().trim().toString();
      home.baths = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(7)').text().trim();
      home.sqft = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(8)').text().trim();
      home.sleep = $('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(9)').text().trim();
      home.img = $('table[style="margin-top:8px;"] table[border="0"] td[width="130"] a:nth-child(1) img').attr('src');
      home.phone = $('table[width="100%"][border="0"][cellspacing="2"][cellpadding="0"][class="navy_12pt"][style="margin-top:10px;"] tr:nth-child(3) span').text().trim();
      //console.log('in the model ' + home);
      cb(null, home);
    }
  });
};

Browse.encode = function(img, cb){
  request({url:img, encoding:null}, function(error, response, body){
    if(!error && response.statusCode === 200){
      var img = 'data:image/png;base64, ' + new Buffer(body).toString('base64');
      cb(null, img);
    }
  });
};

function getZip(link, cb){
  request(link.url, function(error, response, body){
    if(!error && response.statusCode === 200){
      var $$  = cheerio.load(body),
          street = $$('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(2)').text().trim(),
          zip = $$('table[class="navy_12pt"] td[class="navy_12pt"] table[class="navy_12pt"] tr:nth-child(3)').text().trim();
      link.addr = street + ' ' + zip;
      console.log(link);
      cb(null, link);
    }
  });
}

function linkMaker(link){
  var newLink = 'http://www.lakehousevacations.com/' + link;
  return {url: newLink};
}

module.exports = Browse;
