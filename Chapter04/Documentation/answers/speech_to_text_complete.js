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
/**
 * this returns a speech to text token to be used in the browser for direct access
 * to the Watson speech to text service. 
 * @param {NodeJS Request Object} req - provides information about the inbound request
 * @param {NodeJS Response Object} res - this is how we respond back to the browser
 */

exports.stt_token = function(req, res) {
    var sttConfig = extend(config.speech_to_text, vcapServices.getCredentials('speech_to_text'));

    var sttAuthService = watson.authorization(sttConfig);

    sttAuthService.getToken({
        url: sttConfig.url
    }, function(err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token');
            return;
        }
        res.send(token);
    });
}

/**
 * this returns a speech to text token to be used in the browser for direct access
 * to the Watson speech to text service. 
 * @param {NodeJS Request Object} req - provides information about the inbound request
 * This is accessed via a post request rather than a get request. A post request normally
 * has options (data) associated with it and these come in to nodejs as part of the 
 * req.body object.
 * @param {NodeJS Response Object} res - this is how we respond back to the browser
 */

exports.tts_synthesize = function(req, res) {
  console.log("tts_synthesize entered");
  // use the environment variables to configure text to speech
    var ttsConfig = watson.text_to_speech(config.text_to_speech);
    // give the synthesizer the data from the browser.
    // you may find that you get errors if you send in an empty text string. 
    // this can be avoided by testing req.query to see if it has any text in it
    // that would be a good exercise to extend this code
    var transcript = ttsConfig.synthesize(req.query);
    transcript.on('response', function(response) {
      if (req.query.download) {
        response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
    });
    // if there's an error, log it to the server console window.
    transcript.on('error', function(error) { console.log("error encountered: "+error); next(error); });
    // pipe sends the sound as a stream (vs a downloaded file) back to the browser
    transcript.pipe(res);
}
