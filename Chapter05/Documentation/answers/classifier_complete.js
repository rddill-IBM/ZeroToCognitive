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
var cfenv = require('cfenv');
var watson = require('watson-developer-cloud');
var WATSON_NLC_SERVICE_NAME = "Watson-NLC-Service";
var config = require("../../env.json");

var appEnv = cfenv.getAppEnv();

var serviceCreds = appEnv.getServiceCreds(WATSON_NLC_SERVICE_NAME) || process.env.NLC_CREDS || config.watson_nlc;
var natural_language_classifier = watson.natural_language_classifier(serviceCreds);
var classifier_id_industry = process.env.NLC_CLASSIFIER_ID || 'your classifier id goes here';
exports.classifyInd = function(req, res) {
  console.log("Classifier entered");
    _text = req.body.cquery;
    i_output = {};
    (function(_res) {
        natural_language_classifier.classify({
                text: _text,
                classifier_id: classifier_id_industry
            },
            function(err, response) {
                _res.writeHead(200, { "Content-Type": "text/plain" });
                _res.end(nlc_res("Industry", err, response));
            });
    })(res)
}

function nlc_res(classifier, err, response) {
    var _output = [];
    if (err) {
        console.log(classifier + ' error:', err);
        _output = { 'error': JSON.stringify(err, null, 2) };
    } else {
        _output = { results: JSON.stringify(response, null, 2) };
    }
    console.log("Printing from nlc_res");
    console.log(_output);
    return (JSON.stringify(_output, null, 2));
}
