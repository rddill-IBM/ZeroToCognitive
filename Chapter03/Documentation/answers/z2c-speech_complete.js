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
/**
 * initPage is called by the browser once all files have loaded from the server. 
 * This is specified in the index.html file via the <body onLoad='initPage'> statement
 */
function initPage ()
{
  // define the variables we need to access the microphone and stop icons in the web page
  var _mic = $('#microphone'); var _stop = $("#stop");
  // start things off by enabling the microphone button and disabling the stop recording button
    _mic.addClass("mic_enabled");
    _stop.addClass("mic_disabled");

    // Identify what to do when the microphone button has been clicked
  _mic.on("click", function ()
    {
      var _className = this.className;
      // if the microphone button is enabled, then do the following. 
      // otherwise, ignore the mouse button click
      if(this.className == "mic_enabled")
      {
        // disable the microphone, so that clicking it again is ignored
        _mic.addClass("mic_disabled");
        _mic.removeClass("mic_enabled");
        // enable the stop button, so that the speech to text process can be stopped on demand
        _stop.addClass("mic_enabled");
        _stop.removeClass("mic_disabled");
        // get the token from the server.
        // 
        // this only needs to be done once per browser session. Here, we're doing it every time
        // the user wants to talk. It would be better if we got the token in the base initPage function
        // and not on every click request. 
        // I'll leave it to you to make this change, it's pretty simple
        // and will make your app run more smoothly
        //
        $.when($.get('/api/speech-to-text/token')).done(
          function (token) {
            // the stream is what comes in from the microphone
            stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
              // it needs the token received from the server
               token: token,
               // and the outputElement is the html element defined with an id="speech" statement
               outputElement: '#speech' // CSS selector or DOM Element
             });
             // if there's an error in this process, log it to the browser console.
            stream.on('error', function(err) { console.log(err); });
          });
        }
      });

  _stop.on("click",  function() {
    console.log("Stopping text-to-speech service...");
    // the if statement is here in case the stop button was clicked either before the stream 
    // was successfully created, or if there was an error in the creation process. 
    // there are two things we need to test for, first, has stream even been defined?
    // we test for that first because the first test to pass, in an OR situation is the 
    // last test made. So, is the stream undefined? If not, is it defined, but null.
    // in either case, we have no stream to stop.
    // The exclamation point at the beginning is a NOT symbol 
    if (!((typeof(stream) == "undefined") || (stream == null))) {stream.stop(); }
    // just as in the mic.on.click processing, it would be useful to also check 
    // to see if the stop button is enabled, which would make this code more robust. 
    //
    _mic.addClass("mic_enabled");
    _mic.removeClass("mic_disabled");
    _stop.addClass("mic_disabled");
    _stop.removeClass("mic_enabled");
  });
}
