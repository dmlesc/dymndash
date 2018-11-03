'use strict';

const conf = require('./conf/' + process.argv[2]);
const elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: conf.host
  //, log: 'trace'
});

var params = {
  index: '.kibana',
  body: {
    "query": {
      match: {
        title: 'genstate0Devices'
      }
    },
    "size": 2000,
    "_source": {
      "excludes": []
    }
  }
};

client.search(params, (err, res) => {
  if (err)
    console.log(err);
  else {
    //console.log(res);
    console.log(res.hits.hits.length);

    var hits = res.hits.hits;
//    console.log(hits[0]);
    console.log(hits[0]);

    for (var i=0; i<hits.length; i++) {
      var doc = hits[i];
      //console.log(doc._id);
    }

  }
});





function print(arr) {
  console.log('======= ' + arr.length + ' =======');
  for (var i=0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}