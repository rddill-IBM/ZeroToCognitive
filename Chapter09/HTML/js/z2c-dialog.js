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
// Watson dialog
var customDialog = {};
customDialog['initialize'] = {type: 'talk', next: 'start', message: "Hi, my name is Watson. What's your name?"};
customDialog['start'] = {type: 'listen', next: 'name'};
customDialog['name'] = {type: 'talk', next: 'actionAsk', message: "Hi {0}, how can I help you today?"};
customDialog['actionAsk'] = {type: 'listen', next: 'actionSelect'};
customDialog['actionSelect'] = {type: 'talk', next: 'getClassificationText', message: "What would you like to classify?"};
customDialog['getClassificationText'] = {type: 'listen', next: 'classify'};
customDialog['classify'] = {type: 'talk', next: 'classifyAsk', message: "{0}, Your client is most likely in the {1} industry. Would you like to see probabilities for the top 10 industries?"};
customDialog['classifyAsk'] = {type: 'listen', next: 'classifyDetails'};
customDialog['classifyDetails'] = {type: 'process', next: 'name'};

nl_text = {};
nl_text['en']= {};
nl_text.en['voice']={ speaker: "en-US_AllisonVoice", url: "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/en-US_AllisonVoice"}
nl_text['fr']={};
nl_text.fr['voice']={ speaker: "fr-FR_ReneeVoice", url: "https://stream.watsonplatform.net/text-to-speech/api/v1/voices/fr-FR_ReneeVoice"}

nl_text.en['initialize']="Hi, my name is Watson. What's your name?";
nl_text.fr['initialize']="Bonjour, je m'appelle Watson. Comment vous appelez-vous?";



var isFirst = true;
var dialog_target = "";
function eraseName() {document.cookie = "name="; initPage();}

function startDialog(_target)
{
  document.cookie = "prevstep=startDialog";
  NLC_Button.hide();
  dialog_target = $(_target);
  dialog_target.empty();
  if (getCookieValue("name") != "") {document.cookie = "step=name"; nextStep();}
  else { document.cookie = "step=start"; talkToMe(dialog_target, customDialog['initialize'].message); }
}

// talk to me ... use the existing text to speech service to talk to the user
function talkToMe (_target, _string)
{
  _target.append('<div class="shape bubble2"><p>'+_string+'</p></div>');
  speak(_string, a_player_target, false);
}

// create the visual space for the text bubble
function listenToMe(_step)
{
    var chat = "chat_"+_step;
    dialog_target.append('<div class="shape bubble1"><p id="'+chat+'">...</p></div>');
    stt_out = $("#"+chat);
    listen("#"+chat);
}

// figure out the next step in the conversation.
function nextStep()
{
  console.log("previous step was: "+getCookieValue("prevstep")+" and this step is: "+getCookieValue("step"));
  var step = getCookieValue("step");

  switch (step) {
    case 'getClassificationText': // classification requested. enable button, listen
      NLC_Button.show();
    case 'start':  // start of a dialog, don't have person's name
    case 'actionAsk': // request classification
    case 'classifyAsk': // would you like to see the rest of the results?
      listenToMe(getCookieValue("step"));
      incrementStep(customDialog[step].next);
      break;

    case 'name': // have person's name, need to remember it
      // because we're going to allow this program to loop, check to see if we need to clear the dialog and hide the classify button
      if(!isFirst) {NLC_Button.hide(); dialog_target.empty();}
      else {
        // get Name and save it as a cookie
        if (getCookieValue("name") == "")
        { document.cookie = "name="+trimStrip($("#chat_"+getCookieValue("prevstep"))[0].innerText); }
        isFirst=false;
        }
      talkToMe(dialog_target, customDialog[step].message.format(getCookieValue("name")));
      incrementStep(customDialog[step].next);
      break;

    case 'actionSelect': // check if classification requested. if not, return to "how can I help you"
      // check to see if text == classify or classified
      // if so, set up for classification, else reset steo and call nextStep().
      var str = trimStrip($("#chat_"+getCookieValue("prevstep"))[0].innerText).toLowerCase();
      if((str=="classify") || (str=="classified") || (str=="classifier"))
        { talkToMe(dialog_target, customDialog[step].message);
        incrementStep(customDialog[step].next);
        }
        else {
          incrementStep("name");
          nextStep(); }
      break;

    case 'classify': // stop button clicked after classification requested. initiate classification process.
      msg_out = customDialog[step].message;
      var nlcPage = "displayNLC.html";
      if(this.className == "mic_enabled") {toggle_mic(_mic, _stop, false)}
      getIndustryClassification(stt_out, msg_out);
      NLC_Button.hide();
      incrementStep(customDialog[step].next);
      break;

    case 'classifyDetails': // listen for positive response.
      var str = trimStrip($("#chat_"+getCookieValue("prevstep"))[0].innerText).toLowerCase();
      if((str=="yes") || (str=="yup") || (str=="yeah"))
        {
          incrementStep(customDialog[step].next);
          setModal(industryPage, displayNLC, industryTable, nlc_classes); }
        else {
          incrementStep(customDialog[step].next);
          nextStep(); }
      break;

    default: // step has an unexpected value
    console.log('default entered. step = '+step);
      break;
    }
}

function incrementStep(_next)
{
  document.cookie = "prevstep="+getCookieValue("step");
  document.cookie = "step="+_next;
}
