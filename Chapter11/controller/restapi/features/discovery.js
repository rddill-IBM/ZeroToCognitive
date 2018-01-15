/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var config = require('../../env.json');
var fs = require('fs');
var path = require('path');
var qs = require('qs');
var request = require('request');

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
console.log(config.discovery);
var discovery = new DiscoveryV1({
  username: config.discovery.username,
  password: config.discovery.password,
  version: config.discovery.version,
  version_date: config.discovery.version_date
});

/**
 * find queries a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.queryString has the query details
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.find = function(req, res, next)
{
  let _method = 'find';
}

/**
 * getNews returns a json object with all environments, configurations and collections
 * in the Discovery News version, since we are not creating any of the above, there
 * will be one environment, one configuration and one collection returned.get the value of a specific cookie
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * req.body.startDate - when to start looking for documents
 * req.body.endDate - when to stop looking
 * req.body.count - number of documents to return
 * req.body.query - comma delimited string of query words and phrases
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.getNews = function(req, res, next)
{
    var method = "getNews";
    // Discovery wants dates in something very close to ISO format, just without the trailing Z and with a timezone offset
    // so _time forces the time of day to be 8AM
    var _time = 'T12:00:00-0400';
    // The browser sends in 4 values as part of the post command, each of which is delivered to nodesjs as
    // part of req.body. 
    var start_date = req.body.startDate+'T12:00:00-0400';
    var end_date = req.body.endDate+'T12:00:00-0400';
    var qry_count = req.body.count;
    // the Discovery API wants to receive a single JSON object as the passed in parameter. 
    // That JSON object has 7 elements in it, each of which is populated below. 
    var _query = {};
    var qry = '';
    // Discovery allows you to query on multiple terms, just as did Alchemy. However with 
    // Discovery, the terms are separated by a 'pipe' character: | to mean 'or'. The following
    // for/each loop creates the query object.
    __qry__ = req.body.query.split(',');
    console.log(__qry__);
    for (each in __qry__){(function(_idx, _arr){qry += ((_idx == 0) ? ' "'+_arr[_idx]+'" ' : '|'+' "'+_arr[_idx]+'" ');})(each, __qry__);}
    _query.query = qry;
    _query.filter = 'language:(english|en),crawl_date>'+start_date+',crawl_date<'+end_date;
    _query.aggregation = '[nested(enriched_title.entities).filter(enriched_title.entities.type:Company).term(enriched_title.entities.text)]';
    _query.count = parseInt(qry_count);
    _query.return = 'title,url,host,crawl_date, text, enriched_text.sentiment.document, author';
    _query.environment_id = 'system';
    _query.collection_id = 'news';
    console.log(_query);
    discovery.query(_query, function(error, data) {
      var method = "query";
      if (error)
      { // log the error and send an error message back to the browser
        console.log(method+" failed: "+error); 
        res.send({"results":"failed", "data": error});
        }
      else
      { // the following for each loop is purely for diagnostic purposes and is commented
        // out. If you uncomment this section, you will see data sent to your console. 
        /*
        for (each in data.results)
          {console.log('data.results['+each+'].title is: '+data.results[each].title);
          if (each == 0) {console.log(method+" success! "+JSON.stringify(data, null, 2))}
        }
        */
        // log the results on the console and send them back to the browser. 
         res.send({"results":"success", "data": data});
        }
    });
  
}

