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

/**
 * This takes the provided text and delivers it to the classifier you've previously built 
 * using your curl commands 
 * @param {NodeJS Request Object} req - provides information about the inbound request
 * This is accessed via a post request rather than a get request. A post request normally
 * has options (data) associated with it and these come in to nodejs as part of the 
 * req.body object.
 * req.body.cquery - inbound text to be classified
 * @param {NodeJS Response Object} res - this is how we respond back to the browser
 */
exports.classifyInd = function(req, res) {
  console.log("Classifier entered");
    _text = req.body.cquery;
    i_output = {};
    // this async request takes some time to process and we want to ensure that the
    // res(sponse) object is still available to us when the process completes.
    // in this example, we're using an anonymous function to accomplish that objective
    (function(_res) {
        natural_language_classifier.classify({
                text: _text,
                classifier_id: classifier_id_industry
            },
            function(err, response) {
                // set up the response object as a successful http action (that's the 200)
                _res.writeHead(200, { "Content-Type": "text/plain" });
                // and then send back whatever response came back. 
                // the nlc_res routine figures this out.
                _res.end(nlc_res("Industry", err, response));
            });
    })(res)
}

/**
 * This formats the response from the classification process into a JSON object 
 * @param {String} classifier - The type of classification just completed. This is included
 * so that one server request can do multiple classifications simultaneously and send back
 * a JSON object with each of the classification responses separated and easily accessed.
 * It's overkill for this chapter, but a useful technique in more complex environments.
 * @param {ERROR} err - an error object or null if no error
 * @param {JSON} respone - the JSON object response from the classifier. Undefined if an 
 * error occurs
 * @return {STRING} result - a stringify'd version of the _output object.
 */
function nlc_res(classifier, err, response) {
    // define the output array
    var _output = [];
    if (err) {
        // ok, we have an error. Print it to the server console
        console.log(classifier + ' error:', err);
        // format the response JSON object
        _output = { 'error': JSON.stringify(err, null, 2) };
    } else {
        // everything is good. Format the results to send back to the calling routine
        _output = { results: JSON.stringify(response, null, 2) };
    }
    console.log("Printing from nlc_res");
    console.log(_output);
    // send the stringifiyed version of _output back to the caller
    return (JSON.stringify(_output, null, 2));
}
