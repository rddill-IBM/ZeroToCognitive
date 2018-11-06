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

var stt_token;
function initPage ()
{
  var methodName = 'initPage';
  // define the variables we need to access the microphone and stop icons in the web page
  var _mic = $('#microphone'); var _stop = $("#stop");
  $.when($.get('/api/speech-to-text/token')).done(
    function(_token) 
    { if (_token.success != 'undefined')
      {stt_token = _token.success; console.log(methodName+' stt_token request succeeded.');}
      else
      {stt_token = null; console.log(methodName+' token request failed with: ',_token.failed);}
    }
    );
  

  // start things off by enabling the microphone button and disabling the stop recording button
    _mic.addClass("mic_enabled");
    _stop.addClass("mic_disabled");

    // Identify what to do when the microphone button has been clicked
  _mic.on("click", function ()
    {
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
        // the stream is what comes in from the microphone
        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
            // it needs the token received from the server
            access_token: stt_token,
            // and the outputElement is the html element defined with an id="speech" statement
            outputElement: '#speech' // CSS selector or DOM Element
            });
            // if there's an error in this process, log it to the browser console.
        stream.on('error', function(err) { console.log(err); });
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

  // do something useful when the readText button is clicked.
  $('#readText').on("click",  function()
  {
    console.log("initiating text-to-speech service...");
    // if we're going to have Watson talk, we probably don't want it listening at 
    // the same time, so go through the normal 'turn off the microphone' process. 
    // this is missing an if statement, which would make the code more robust.
    // can you figure out what's missing?
    //
    if (!((typeof(stream) == "undefined") || (stream == null))) {stream.stop(); }
    _mic.addClass("mic_enabled");
    _mic.removeClass("mic_disabled");
    _stop.addClass("mic_disabled");
    _stop.removeClass("mic_enabled");

    var sessionPermissions = JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1;
    // get the text to be turned into an audio signal
    var textString = $("#chat").val();
    // select the voice to use (this is assuming US English as the language.)
    // change the en-US_AllisonVoice to a different language if desired.
    var voice = 'en-US_AllisonVoice';
    // get the audio element from the HTML 5 audio player
    var audio = $("#a_player").get(0);
    // build the url to call to synthesize the text
    var synthesizeURL = '/api/text-to-speech/synthesize' +
      '?voice=' + voice +
      '&text=' + encodeURIComponent(textString) +
      '&X-WDC-PL-OPT-OUT=' +  sessionPermissions;
    // attach the synthesize URL to the audio player  
    audio.src = synthesizeURL
    // and pause it in case it's currently running
    audio.pause();
    // add an event listener and the function to call when the voice comes back
    audio.addEventListener('canplaythrough', onCanplaythrough);
    // mute the audio player
    audio.muted = true;
    // set the audio element to play mode, to prepare it for the returning signal
    audio.play();
    // change the cursor so that there's a visual cue that we're now waiting on the server 
    // to send an audio signal back
    $('body').css('cursor', 'wait');
    $('.readText').css('cursor', 'wait');
    return true;
  });
}
/**
 * This function is called each time an audio signal comes back from the server
 */
function onCanplaythrough() {
  console.log('onCanplaythrough');
  // get the audio player (we could save a step if we passed that in as a parameter from the preceding function)
  var audio = $('#a_player').get(0);
  // remove the event listener. 
  // Why are we doing this? 
  // Each time the readText button is clicked, we add an event listener. But we only want one,
  // so once the event listener process kicks off, we remove the current listener. 
  // this lightens the load on the browser and makes the application more robust
  audio.removeEventListener('canplaythrough', onCanplaythrough);
  // some versions of FireFox have an undetermined bug which causes the audio player to
  // fail if the following try/catch block is missing
  try { audio.currentTime = 0; }
  catch(ex) { // ignore. Firefox just freaks out here for no apparent reason.
            }
  // display the audio controls
  audio.controls = true;
  // unmute the player
  audio.muted = false;
  // animate the audio player, so that there is a visual cue on where we are in the 
  // current playback
  $('html, body').animate({scrollTop: $('#a_player').offset().top}, 500);
  // reset the cursor to whatever the user has specified as their default browser cursor. 
  $('body').css('cursor', 'default');
}
