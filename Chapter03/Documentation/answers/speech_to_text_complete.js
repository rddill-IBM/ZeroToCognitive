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

 // get required modules for speech to text
var extend = require('extend');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');

// load in the environment data for our application
var config = require('../../env.json');

/**
 * this returns a speech to text token to be used in the browser for direct access
 * to the Watson speech to text service. 
 * @param {NodeJS Request Object} req - provides information about the inbound request
 * @param {NodeJS Response Object} res - this is how we respond back to the browser
 */
exports.token = function(req, res) {
    // the extend function adds additional information into our credentials from within the 
    // Watson and Bluemix operating environment
    var sttConfig = extend(config.speech_to_text, vcapServices.getCredentials('speech_to_text'));
    // request authorization to access the service
    var sttAuthService = watson.authorization(sttConfig);

    // now that we're authenticated, get the token
    sttAuthService.getToken({
        url: sttConfig.url
    }, function(err, token) {
        if (err) {
            // send an error back if we cannot retrieve the token successfully
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token'+ReferenceError);
            return;
        }
        // if we're successful, then send the new token back to the browser
        res.send(token);
    });
}
