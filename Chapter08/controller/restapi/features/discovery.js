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

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
console.log(config.discovery);
var discovery = new DiscoveryV1({
  username: config.discovery.username,
  password: config.discovery.password,
  version: config.discovery.version,
  version_date: config.discovery.version_date
});

/**
 * getID returns a json object with all environments, configurations and collections
 * in the Discovery News version, since we are not creating any of the above, there
 * will be one environment, one configuration and one collection returned.
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.getID = function(req, res, next)
{
    var method = "getID";
    discovery.getEnvironments({}, function(error, data) {
        if (error)
        {

        }
        else
        {

        }
      });
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

    // the Discovery API wants to receive a single JSON object as the passed in parameter. 
    // That JSON object has 7 elements in it, each of which is populated below. 
    var _query = {};
    var qry;
    // Discovery allows you to query on multiple terms, just as did Alchemy. However with 
    // Discovery, the terms are separated by a 'pipe' character: | to mean 'or'. The following
    // for/each loop creates the query object.

    _query.query = '"'+qry+'"';

    _query.aggregation = '[nested(enriched_title.entities).filter(enriched_title.entities.type:Company).term(enriched_title.entities.text)]';

    _query.return = 'title,url,host,crawl_date, text, enriched_text.sentiment.document, author';
    _query.environment_id = 'system';
    _query.collection_id = 'news';
    console.log(_query);
    discovery.query(_query, function(error, data) {
      var method = "query";
      if (error)
      { // log the error and send an error message back to the browser

    }
      else
      { // the following for each loop is purely for diagnostic purposes and is commented
        // out. If you uncomment this section, you will see data sent to your console. 

    }
    });
  
}
