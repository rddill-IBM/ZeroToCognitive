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
// doc-conversion.js
// train.py -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF -i rankingQuestions.csv -c sc2c46ac51_4d85_4b7e_b642_a73b44f65cc5 -x IBVArticles -r 5 -n z2cChapter11
// curl -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF  "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/rankers/76643bx23-rank-282"
// curl -X POST -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF  "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc2c46ac51_4d85_4b7e_b642_a73b44f65cc5/solr/IBVArticles/select?q=what%20critical%20issues%20are%20CEOs%20facing%20today&wt=json&fl=id,title"

var watson = require('watson-developer-cloud');
var fs = require('fs');
var env = require("../../env.json");
var path = require('path');
var qs = require('qs');


var document_conversion = watson.document_conversion({
  username:     env.documentConversion.username,
  password:     env.documentConversion.password,
  version:      'v1',
  version_date: '2015-12-15'
});

var retrieve_and_rank = watson.retrieve_and_rank({
  username: env.retrieveAndRank.username,
  password: env.retrieveAndRank.password,
  version: 'v1'
});
var params = {
  cluster_id: env.retrieveAndRank.cluster_id,
  collection_name: env.retrieveAndRank.collection_name,
  wt: 'json'
};
// custom configuration
var config = {
      "pdf": { "heading": { "fonts":
        [
          {"level": 1, "min_size": 24, "max_size": 80},
          {"level": 2, "min_size": 18, "max_size": 24, "bold": false, "italic": false},
          {"level": 2, "min_size": 18, "max_size": 24, "bold": true},
          {"level": 3, "min_size": 13, "max_size": 18, "bold": false, "italic": false},
          {"level": 3, "min_size": 13, "max_size": 18, "bold": true},
          {"level": 4, "min_size": 11, "max_size": 13, "bold": true, "italic": false}
        ] } }
      };

exports.convert = function(req, res)
{

}
exports.add = function(req, res)
{

}
function formatForSolr(_file, _name)
{

}
exports.combine = function(req, res, next)
{

}
exports.getDocList=function(req, res, next)
{

}
exports.updateDocList=function(req, res, next)
{

}
exports.saveQuestion=function(req, res, next)
{

}
exports.search=function(req, res, next)
{

}

exports.find=function(req, res, next)
{

}

function displayObjectValues (_string, _object)
{
  for (prop in _object){
      console.log(_string+prop+": "+(((typeof(_object[prop]) == 'object') || (typeof(_object[prop]) == 'function'))  ? typeof(_object[prop]) : _object[prop]));}
}
