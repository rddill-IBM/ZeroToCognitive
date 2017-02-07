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
  var readText = $("#readText"); var displayNLC = $("#classifySpeech");
  var stt_out = $("#speech");
  var stream = null;
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
// extract speech to text to separate function
        talk(stt_out);
        }
      });

  _stop.on("click",  function()
  {
    console.log("Stopping speech-to-text service...");
    if (stream != undefined) {stream.stop(); }
    _mic.addClass("mic_enabled");
    _mic.removeClass("mic_disabled");
    _stop.addClass("mic_disabled");
    _stop.removeClass("mic_enabled");
  });

  readText.on("click",  function()
  {
    console.log("initiating text-to-speech service...");
    if (stream != undefined) {stream.stop(); }
    _mic.addClass("mic_enabled");
    _mic.removeClass("mic_disabled");
    _stop.addClass("mic_disabled");
    _stop.removeClass("mic_enabled");

// extrak the speaking part to a new function.
    speak($("#chat").val(), a_player, true);
    $('body').css('cursor', 'wait');
    $('.readText').css('cursor', 'wait');
    return true;
  });

    displayNLC.on("click",  function()
    {
      var nlcPage = "displayNLC.html";
      checkNLC(nlcPage, stt_out);
    });
}
// create a function to handle speech to text in general
// pass in the name of the HTML object which will display the received text.
function talk(_stt_out)
{
  $.when($.get('/api/speech-to-text/token')).done(
    function (token) {
      stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
         token: token,
         outputElement: '#'+_stt_out // CSS selector or DOM Element
       });
      stream.on('error', function(err) { console.log(err); });
    });

}
// create a function to handle text to speech in general
// pass in the text string to be read, the audio player to use and if the audio player should be displayed.
function speak (_chat, _a_player, b_display)
{
  var sessionPermissions = JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1;
  var textString = _chat;
  var voice = 'en-US_AllisonVoice';
  var audio = $("#"+_a_player).get(0);
  var synthesizeURL = '/api/text-to-speech/synthesize' +
    '?voice=' + voice +
    '&text=' + encodeURIComponent(textString) +
    '&X-WDC-PL-OPT-OUT=' +  sessionPermissions;
  audio.src = synthesizeURL
  audio.pause();
  audio.addEventListener('canplaythrough', onCanplaythrough);
  audio.muted = true;
  audio.play();
  (b_display) ? audio.show() : audio.hide();
}

function onCanplaythrough() {
  console.log('onCanplaythrough');
  var audio = $('#a_player').get(0);
  audio.removeEventListener('canplaythrough', onCanplaythrough);
  try { audio.currentTime = 0; }
  catch(ex) { // ignore. Firefox just freaks out here for no apparent reason.
            }
  audio.controls = true;
  audio.muted = false;
  $('html, body').animate({scrollTop: $('#a_player').offset().top}, 500);
  $('body').css('cursor', 'default');
}
