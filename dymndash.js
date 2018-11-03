'use strict';

const conf = require('./conf/' + process.argv[2]);
const amilli = require('./amilli');
const kibComp = require('./kibComp');
const regions = require('./regions');
const metrics = require('./metrics');
const filterObjs = require('./filterObjs');
const rangeObjs = require('./rangeObjs');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const elasticsearch = require('elasticsearch');
var elastic = new elasticsearch.Client({
  host: conf.host
  //, log: 'trace'
});

var input = fs.readFileSync('result.csv');
var LUT = parse(input, { columns: true, quote: '', rowDelimiter: ' '} );

var baseT = 'gen0 - TSE Region - ';
var baseStateT = 'gen0 - State - ';
var siteCodesByState = {};
var stateQueries = {};
var dashIDs = {};
var dashIDsState = {};
var dashIDsStateDevices = {};
var queue = [];

var d = new Date();
var now = d.getTime();
var gte = now - amilli.sixty_days;

var searchParams = {
  index: 'logs-inde*',
  body: {
    "query": {
      "bool": {
        "must": [
          {
            "query_string": {
              "query": "Source:Client",
              "analyze_wildcard": true
            }
          },
          {
            "range": {
              "TimeStamp": {
                "gte": gte,
                "lte": now,
                "format": "epoch_millis"
              }
            }
          }
        ],
        "must_not": []
      }
    },
    "size": 0,
    "_source": {
      "excludes": []
    },
    "aggs": {
      "2": {
        "terms": {
          "field": "SiteCode.raw",
          "size": 3000,
          "order": {
            "_count": "desc"
          }
        }
      }
    }
  }
};

elastic.search(searchParams, (err, res) => {
  if (err)
    console.log(err);
  else {
    matchToState(res.aggregations['2'].buckets);
  }
});

function matchToState(sitecodes) {
  //console.log('Unique SiteCodes: ', sitecodes.length);
  for (var i=0; i < sitecodes.length; i++) {
    var sitecode = sitecodes[i].key;
    var count = sitecodes[i].doc_count;

    sitecode = sitecode.split(' ')[0];
    if (!sitecode.includes('http'))
      sitecode = sitecode.replace(/\\|\//g, '');

    var obj = { SiteCode: sitecode, Count: count };
    var state = getState(sitecode);

    if (!siteCodesByState[state])
      siteCodesByState[state] = [];
    siteCodesByState[state].push(obj);
  }

  generateStateQueries();
}

function getState(sitecode)  {
  for (var i=0; i < LUT.length; i++) {
    if (LUT[i]['SITE_CODE'] == sitecode)
      return LUT[i]['STATE'];
  }
  return 'not found';
}

function generateStateQueries() {
  Object.keys(siteCodesByState).forEach( (state) => {
      var SiteCodes = (siteCodesByState[state]);
      var query = '';

      for (var i=0; i < SiteCodes.length; i++) {
        var code = SiteCodes[i].SiteCode;

        if (code !== '') {
          if (code.includes(':'))
            query += 'SiteCode:\"' + code + '\" OR ';
          else
            query += 'SiteCode:' + code + ' OR ';
        }
      }

      query = query.substring(0, query.length - 4);
      stateQueries[state] = query;
  });

//  createViz();
//  createStateViz();
  createStateDevicesViz();
}


var clientBaseQ = 'Source:Client';
var measEndQ = ' AND _exists_:Measurement AND -Activity:EndOfSession ';
var measureQ = ' AND Measurement:[0 TO 120000]';
var actLoadQ = ' AND Message:"Total Activity Load Time"' + measEndQ;
var mediaThroughputQ = ' AND Message:"MediaThroughput (Kb/s)" AND _exists_:Measurement AND Measurement:[0 TO 500000]';
var errorQ = ' AND Severity:Error';


function createViz() {
  Object.keys(regions).forEach( (tse) => {
    dashIDs[tse] = [];
    var states = regions[tse];
    var title = baseT + tse + ' - ';
    
    var q = clientBaseQ + actLoadQ;
    queue.push([kibComp.line, title + 'Line - ActLoaded', q, states, metrics.actLoaded, tse]);
    queue.push([kibComp.table, title + 'Table - ActLoaded', q, states, metrics.actLoaded, tse]);

    var q = clientBaseQ + actLoadQ + actLoadQTime;
    queue.push([kibComp.line, title + 'Line - AvgLoadTime', q, states, metrics.avgLoadTime, tse]);
    queue.push([kibComp.table, title + 'Table - AvgLoadTime', q, states, metrics.avgLoadTime, tse]);

    var q = clientBaseQ + mediaThroughputQ;
    queue.push([kibComp.line, title + 'Line - MediaThroughput', q, states, metrics.avgMediaThroughput, tse]);
    queue.push([kibComp.table, title + 'Table - MediaThroughput', q, states, metrics.avgMediaThroughput, tse]);
    
    var q = clientBaseQ + errorQ;
    queue.push([kibComp.line, title + 'Line - Error', q, states, metrics.error, tse]);
    queue.push([kibComp.table, title + 'Table - Error', q, states, metrics.error, tse]);
  });

  generateVizByTSE(queue.shift());
}

function generateVizByTSE(params) {
  console.log('generateVizByTSE');
  var comp = params[0];
  var title = params[1];
  var query = params[2];
  var states = params[3];
  var metric = params[4];
  var tse = params[5];

  //var viz = JSON.parse(JSON.stringify(comp));
  var viz = copy(comp);
  viz.title = title;
  viz.visState.title = title;
  var aggs = viz.visState.aggs;
  aggs[0] = metric;

  var filters;
  if (aggs[1].params.filters)
    filters = aggs[1].params.filters;
  else
    filters = aggs[2].params.filters;
  
  Object.keys(stateQueries).forEach( (state) => {
    if (states.indexOf(state) !== -1) {
      //var filter = JSON.parse(JSON.stringify(kibComp.filter));
      var filter = copy(kibComp.filter);
      filter.input.query.query_string.query = stateQueries[state];
      filter.label = state;
      filters.push(filter);
    }
  });

  viz.visState = JSON.stringify(viz.visState);
  viz.uiStateJSON = JSON.stringify(viz.uiStateJSON);
  viz.kibanaSavedObjectMeta.searchSourceJSON.query.query_string.query = query;
  viz.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(viz.kibanaSavedObjectMeta.searchSourceJSON);

  indexViz(viz, tse);
}

function indexViz(viz, tse) {
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'visualization';
  doc.body = viz;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else {
      //console.log(res._id, tse);
      dashIDs[tse].push(res._id);

      if (queue.length)
        generateVizByTSE(queue.shift());
      else
        createDash();
    }
  });
}

function createDash() {
  Object.keys(dashIDs).forEach( (tse) => {
    //var dashboard = JSON.parse(JSON.stringify(kibComp.dashboard));
    var dashboard = copy(kibComp.dashboard);
    dashboard.title = baseT + tse;
    var ids = dashIDs[tse];

    for (var i=0; i<ids.length; i++)
      dashboard.panelsJSON[i].id = ids[i];

    dashboard.panelsJSON = JSON.stringify(dashboard.panelsJSON);
    indexDash(dashboard);
  });
}

function indexDash(dash) {
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'dashboard';
  doc.body = dash;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else
      console.log(res);
  });
}


function createLine(filters, title, q, state, aggs0) {
  var params = [];
  params.push(kibComp.line);
  params.push(title);
  params.push(q);
  var aggs = copy(kibComp.line.visState.aggs);
  if (aggs0) {
    aggs[0] = copy(aggs0);
  }
  aggs[2].params.filters = copy(filters);
  params.push(aggs);
  params.push(state);

  return params;
}


function createStateViz() {
  console.log('createStateViz');
  var delayedSessionQ = ' AND (Message:"Delayed Session encountered" OR Message:"Sad cat Shown")';
  var managerLoadQ = ' AND Message:"Manager API round trip time"' + measEndQ;
  var getNextActivityQ = ' AND Message:"Get Next Activity round trip time"' + measEndQ;
  var activityCompletedQ = ' AND Message:"Activity Completed round trip time"' + measEndQ;
  var downloadMediaQ = ' AND Message:"Activity Download Media Time"' + measEndQ;

  Object.keys(stateQueries).forEach( (state) => {
      dashIDsState[state] = [];
      var stateQ = stateQueries[state];
      var title = baseStateT + state + ' - ';
      
      var q = clientBaseQ + ' AND (' + stateQ + ')' + actLoadQ + measureQ;
      var aggs = [
        metrics.actLoaded, 
        metrics.avgLoadTime, 
        metrics.uniqueUsername,
        metrics.uniqueDeviceIds,
        metrics.uniqueVersions,
        metrics.uniqueDeviceModels,
        metrics.uniqueOperatingSystems,
        metrics.uniquePlatforms,
        metrics.sitecode
      ];

      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 10;
      queue.push([comp, title + 'Table - multiple', q, aggs, state]);


//=====================

//
      var q = clientBaseQ + errorQ + ' AND (' + stateQ + ')';
      /*var aggs = copy(kibComp.line.visState.aggs);
      aggs[2].params.filters = copy(filterObjs.Errors);
      queue.push([kibComp.line, title + 'Line - Errors', q, aggs, state]);*/

      queue.push(createLine(filterObjs.Errors, title + 'Line - Errors', q, state));

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1].params.filters = copy(filterObjs.Errors);
      queue.push([kibComp.table, title + 'Table - Errors', q, aggs, state]);

//
      q += delayedSessionQ;
      /*var aggs = copy(kibComp.line.visState.aggs);
      aggs[2].params.filters = copy(filterObjs.DelayedSession);
      queue.push([kibComp.line, title + 'Line - DelayedSession', q, aggs, state]);*/

      queue.push(createLine(filterObjs.DelayedSession, title + 'Line - DelayedSession', q, state));

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1].params.filters = copy(filterObjs.DelayedSession);
      queue.push([kibComp.table, title + 'Table - DelayedSession', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + measEndQ + measureQ;
      /*var aggs = copy(kibComp.line.visState.aggs);
      aggs[0] = copy(metrics.avgLoadTime);
      aggs[2].params.filters = copy(filterObjs.APItime);
      queue.push([kibComp.line, title + 'Line - API time', q, aggs, state]);*/

      queue.push(createLine(filterObjs.APItime, title + 'Line - API time', q, state, metrics.avgLoadTime));

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[0] = copy(metrics.avgLoadTime);
      aggs[1].params.filters = copy(filterObjs.APItime);
      queue.push([kibComp.table, title + 'Table - API time', q, aggs, state]);


//=====================

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + actLoadQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.TotalActivityLoad_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.TotalActivityLoad);
      queue.push([comp, title + 'Range - TotalActivityLoad', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.TotalActivityLoad);
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - TotalActivityLoad', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + managerLoadQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.ManagerLoad_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.ManagerLoad);
      queue.push([comp, title + 'Range - ManagerAPI', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.ManagerLoad);
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - ManagerAPI', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + getNextActivityQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.GetNextActivity_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.GetNextActivity);
      queue.push([comp, title + 'Range - GetNextActivity', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.GetNextActivity);
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - GetNextActivity', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + activityCompletedQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.ActivityCompleted_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.ActivityCompleted);
      queue.push([comp, title + 'Range - ActivityCompleted', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.ActivityCompleted);
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - ActivityCompleted', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + downloadMediaQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.DownloadMedia_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.DownloadMedia);
      queue.push([comp, title + 'Range - DownloadMedia', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.DownloadMedia);
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - DownloadMedia', q, aggs, state]);

//
      var q = clientBaseQ + ' AND (' + stateQ + ')' + mediaThroughputQ;
      var comp = copy(kibComp.histogram);
      comp.uiStateJSON.vis.colors = copy(rangeObjs.MediaThroughput_colors);
      var aggs = copy(kibComp.histogram.visState.aggs);
      aggs[2].params.ranges = copy(rangeObjs.MediaThroughput);
      queue.push([comp, title + 'Range - MediaThroughput', q, aggs, state]);

      var aggs = copy(kibComp.table.visState.aggs);
      aggs[1] = copy(metrics.range);
      aggs[1].params.ranges = copy(rangeObjs.MediaThroughput);
      aggs[1].params.customLabel = "Throughput (Kb/s)";
      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 4;
      queue.push([comp, title + 'Range - Table - MediaThroughput', q, aggs, state]);

  });

  generateVizByState(queue.shift());
}

function generateVizByState(params) {
  //console.log('generateVizByState');
  var comp = params[0];
  var title = params[1];
  var query = params[2];
  var aggs = params[3];
  var state = params[4];

  var viz = JSON.parse(JSON.stringify(comp));
  viz.title = title;
  viz.visState.title = title;
  var vizAggs = viz.visState.aggs;

  for (var i=0; i<aggs.length; i++) {
    var agg = aggs[i];
    agg.id = (i + 1).toString();
    vizAggs[i] = agg;
  }

  viz.visState = JSON.stringify(viz.visState);
  viz.uiStateJSON = JSON.stringify(viz.uiStateJSON);
  viz.kibanaSavedObjectMeta.searchSourceJSON.query.query_string.query = query;
  viz.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(viz.kibanaSavedObjectMeta.searchSourceJSON);

  indexVizState(viz, state);
}

function indexVizState(viz, state) {
  console.log(viz.title, state);
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'visualization';
  doc.body = viz;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else {
      //console.log(res._id, state);
      dashIDsState[state].push(res._id);

      if (queue.length)
        generateVizByState(queue.shift());
      else {
        console.log('queue empty');
        createDashState();
      }
    }
  });
}

function createDashState() {

  Object.keys(dashIDsState).forEach( (state) => {
    var dashboard = JSON.parse(JSON.stringify(kibComp.dashboardState));
    dashboard.title = baseStateT + state;
    var ids = dashIDsState[state];

    for (var i=0; i<ids.length; i++)
      dashboard.panelsJSON[i].id = ids[i];

    dashboard.panelsJSON = JSON.stringify(dashboard.panelsJSON);
    indexDashState(dashboard);
  });
}

function indexDashState(dash) {
  console.log(dash.title);
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'dashboard';
  doc.body = dash;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else {
      //console.log(res);
    }
  });
}



function createStateDevicesViz() {
  console.log('createStateDevicesViz');

  Object.keys(stateQueries).forEach( (state) => {
      dashIDsStateDevices[state] = [];
      var stateQ = stateQueries[state];
      var title = baseStateT + state + ' - Devices - ';
      
      var q = 'Source:Client AND (' + stateQ + ')' + ' AND Message:"Student successfully logged in"';

      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 15;
      var aggs = copy(kibComp.table.visState.aggs);
      aggs[0].params.customLabel = "Total Logins";
      aggs[1] = copy(metrics.sitecode);
      queue.push([comp, title + 'SiteCode', q, aggs, state]);

      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 15;
      var aggs = copy(kibComp.table.visState.aggs);
      aggs[0].params.customLabel = "Total Logins";
      aggs[1] = copy(metrics.deviceModel);
      aggs.push(copy(metrics.uniqueDeviceIds));
      queue.push([comp, title + 'DeviceModel', q, aggs, state]);

      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 5;
      var aggs = copy(kibComp.table.visState.aggs);
      aggs[0].params.customLabel = "Total Logins";
      aggs[1] = copy(metrics.operatingSystem);
      queue.push([comp, title + 'OperatingSystem', q, aggs, state]);

      var comp = copy(kibComp.table);
      comp.visState.params.perPage = 5;
      var aggs = copy(kibComp.table.visState.aggs);
      aggs[0].params.customLabel = "Total Logins";
      aggs[1] = copy(metrics.version);
      queue.push([comp, title + 'Version', q, aggs, state]);
  });

  generateVizByStateDevices(queue.shift());
}

function generateVizByStateDevices(params) {
  //console.log('generateVizByStateDevices');
  var comp = params[0];
  var title = params[1];
  var query = params[2];
  var aggs = params[3];
  var state = params[4];

  var viz = JSON.parse(JSON.stringify(comp));
  viz.title = title;
  viz.visState.title = title;
  var vizAggs = viz.visState.aggs;

  for (var i=0; i<aggs.length; i++) {
    var agg = aggs[i];
    agg.id = (i + 1).toString();
    vizAggs[i] = agg;
  }

  viz.visState = JSON.stringify(viz.visState);
  viz.uiStateJSON = JSON.stringify(viz.uiStateJSON);
  viz.kibanaSavedObjectMeta.searchSourceJSON.query.query_string.query = query;
  viz.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(viz.kibanaSavedObjectMeta.searchSourceJSON);

  indexVizStateDevices(viz, state);
}

function indexVizStateDevices(viz, state) {
  console.log(viz.title, state);
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'visualization';
  doc.body = viz;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else {
      //console.log(res._id, state);
      dashIDsStateDevices[state].push(res._id);

      if (queue.length)
        generateVizByStateDevices(queue.shift());
      else {
        console.log('queue empty');
        createDashStateDevices();
      }
    }
  });
}

function createDashStateDevices() {

  Object.keys(dashIDsStateDevices).forEach( (state) => {
    var dashboard = JSON.parse(JSON.stringify(kibComp.dashboardStateDevices));
    dashboard.title = baseStateT + state + ' - Devices';
    var ids = dashIDsStateDevices[state];

    for (var i=0; i<ids.length; i++)
      dashboard.panelsJSON[i].id = ids[i];

    dashboard.panelsJSON = JSON.stringify(dashboard.panelsJSON);
    indexDashStateDevices(dashboard);
  });
}

function indexDashStateDevices(dash) {
  console.log(dash.title);
  var doc = {};
  doc.index = '.kibana';
  doc.type = 'dashboard';
  doc.body = dash;

  elastic.index(doc, (err, res) => {
    if (err)
      console.log(err);
    else {
      //console.log(res);
    }
  });
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
