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
/*
** z2c-speech.js
*/

function initPage ()
{
  var _mic = $('#microphone'); var _stop = $("#stop");
  var readText = $("#readText"); var stream = null;
    _mic.addClass("mic_enabled");
    _stop.addClass("mic_disabled");


  _mic.on("click", function ()
    {
      var _className = this.className;
      if(this.className == "mic_enabled")
      {
        _mic.addClass("mic_disabled");
        _mic.removeClass("mic_enabled");
        _stop.addClass("mic_enabled");
        _stop.removeClass("mic_disabled");
        $.when($.get('/api/speech-to-text/token')).done(
          function (token) {
            stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
               token: token,
               outputElement: '#speech' // CSS selector or DOM Element
             });
            stream.on('error', function(err) { console.log(err); });
          });
        }
      });

  _stop.on("click",  function() {
          console.log("Stopping text-to-speech service...");
          if (stream != undefined) {stream.stop(); }
          _mic.addClass("mic_enabled");
          _mic.removeClass("mic_disabled");
          _stop.addClass("mic_disabled");
          _stop.removeClass("mic_enabled");
        });

  readText.on("click",  function() {
          console.log("initiating text-to-speech service...");

          });
}

function onCanplaythrough() {
  console.log('onCanplaythrough');

}
