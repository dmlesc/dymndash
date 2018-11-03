'use strict';

var sitecode = process.argv[2];
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

var input = fs.readFileSync('result.csv');
var LUT = parse(input, { columns: true, quote: '', rowDelimiter: ' '} );

function getState(sitecode)  {
  for (var i=0; i < LUT.length; i++) {
    if (LUT[i]['SITE_CODE'] == sitecode)
      return LUT[i]['STATE'];
  }
  return 'not found';
}

console.log(getState(sitecode));