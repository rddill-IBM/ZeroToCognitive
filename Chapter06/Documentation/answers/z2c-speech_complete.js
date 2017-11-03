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
var a_player_target = "#a_player";
var NLC_Button ; var stt_out; var msg_out;
var _mic; var _stop;
var b_token;
/**
 * invoke this function when the html page has completed loading
 */
function initPage ()
{
  // initialize the b_token value to false. This means that we have not yet retrieved the speech to text token. 
  b_token = false;
  // create a cookie to hold the speech to text token
  document.cookie = "stt-token=";
  _mic = $('#microphone'); _stop = $("#stop");
  var readText = $("#readText"); NLC_Button = $("#classifySpeech");
  // where do we place speech to text output
  var stt_target = '#speech'; stt_out = $(stt_target);
  // local variables to hold chat and conversation html targets
  var chat = $('#chat'); var dialog_target = '#conversation';
  var stream;
  // code refactor!
  // the inline code we used to enable and disable the microphone and stop buttons as been
  // refactored into a single function call, so that we stop replicating that logic
  // throughout the code.
  toggle_mic(_mic, _stop, false)

  _mic.on("click", function ()
    {
      var _className = this.className;
      if(this.className == "mic_enabled")
      {
        // invoke the toggle function
        toggle_mic(_mic, _stop, true)
        // get whatever is the next step in the dialog. That logic is defined and controlled in the z2c-dialog.js file
        nextStep();
        }
      });

  _stop.on("click",  function()
  {
    if(this.className == "mic_enabled")
    {
    toggle_mic(_mic, _stop, false)
    nextStep();
    }
  });

  NLC_Button.on("click",  function()
    {
      nextStep();
    });
    startDialog(dialog_target);
}
/**
 * This is a refactoring of the logic from previous chapters which toggled the state
 * of the microphone and stop icons. 
 * @param {jQuery object} _microphone - Jquery object pointing to the microphone html element
 * @param {jQuery object} _stopbutton - Jquery object pointing to the stop html element
 * @param {boolean} b_on - boolean flag identifying if this is to enable the stop button (true) or the microphone (false)
 */
function toggle_mic(_microphone, _stopbutton, b_on)
{
  if(b_on) // microphone button clicked, enable stop button
  {
    _microphone.addClass("mic_disabled");
    _microphone.removeClass("mic_enabled");
    _stopbutton.addClass("mic_enabled");
    _stopbutton.removeClass("mic_disabled");
  } else // stop button clicked, enable microphone button
  {
    if (!(typeof(stream) == "undefined") || (stream == null)) {stream.stop(); }
    _microphone.addClass("mic_enabled");
    _microphone.removeClass("mic_disabled");
    _stopbutton.addClass("mic_disabled");
    _stopbutton.removeClass("mic_enabled");
  }
}

/**
 * create a function to handle speech to text in general
 * pass in the name of the HTML object which will display the received text. 
 * This function has been refactored so that the get token function is called only once, rather
 * than every time the microphone has been activated.
 * @param {jQuery object} _target - Jquery object pointing to the speech to text output html element
 */
function listen(_target)
{
  // b_token is a boolean (e.g. only true or false) flag that tells us if we have previously retrieved a token 
  if (!b_token)
  {
    // get the token
    $.when($.get('/api/speech-to-text/token')).done(
      function (token) {
        // save the token returned by the server
        document.cookie = "stt-token="+token;
        // set the boolean flag to indicate that we have both retrieved AND saved the token
        b_token = true
        // set up the stream from the microphone to Watson
        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
           token: token,
           outputElement: _target // CSS selector or DOM Element
         });
         // if there is an error, display it on the browser console.
        stream.on('error', function(err) { console.log(err); });
      });
  }else
  {
      // set up the stream from the microphone to Watson
      stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        // retrieve the previously saved token
      token: getCookieValue("stt-token"),
      outputElement: _target // CSS selector or DOM Element
    });
    // if there is an error, display it on the browser console.
   stream.on('error', function(err) { console.log(err); });

  }
}
// create a function to handle text to speech in general
// pass in the text string to be read, the audio player to use and if the audio player should be displayed.
function speak (_chat, _a_player_target, b_display)
{
  var sessionPermissions = JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1;
  var textString = _chat;
  var voice = 'en-US_AllisonVoice';
  var audioFrame = $(_a_player_target);
  var audio = audioFrame.get(0);
  var synthesizeURL = '/api/text-to-speech/synthesize' +
    '?voice=' + voice +
    '&text=' + encodeURIComponent(textString) +
    '&X-WDC-PL-OPT-OUT=' +  sessionPermissions;
  audio.src = synthesizeURL
  audio.pause();
  audio.addEventListener('canplaythrough', onCanplaythrough);
  audio.muted = true;
  audio.play();
  (b_display) ? audioFrame.show() : audioFrame.hide();
}

function onCanplaythrough() {
  var audio = $(a_player_target).get(0);
  audio.removeEventListener('canplaythrough', onCanplaythrough);
  try { audio.currentTime = 0; }
  catch(ex) { // ignore. Firefox just freaks out here for no apparent reason.
            }
  audio.controls = true;
  audio.muted = false;
  $('html, body').animate({scrollTop: $('#a_player').offset().top}, 500);
  $('body').css('cursor', 'default');
}
