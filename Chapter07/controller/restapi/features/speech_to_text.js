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

exports.stt_token = function(req, res) {
    var sttConfig = extend(config.speech_to_text, vcapServices.getCredentials('speech_to_text'));
    var sttAuthService = watson.authorization(sttConfig);

    sttAuthService.getToken({
        url: sttConfig.url
    }, function(err, token) {
        if (err) {
            res.status(500).send('Error retrieving token');
            return;
        }
        res.send(token);
    });
}

exports.tts_synthesize = function(req, res) {
    var ttsConfig = watson.text_to_speech(config.text_to_speech);
    var transcript = ttsConfig.synthesize(req.query);
    transcript.on('response', function(response) {
      if (req.query.download) {
        response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
      }
    });
    transcript.on('error', function(error) { console.log("error encountered: "+error); next(error); });
    transcript.pipe(res);
}
