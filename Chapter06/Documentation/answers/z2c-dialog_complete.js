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

// To build a custom dialog, we need to understand where we are, what we're supposed to do and, if it's predictable, where we go next.
// the customDialog object uses the first value (['initialize'], or ['start'], or ['name'], etc)
// to name the current step. Each step, along with this name, has a JSON object with either 2 0r 3 parameters.
// if the JSON 'type' value is 'talk', then we need to know what to say. In this situation, we have the 3rd parameter: message
// otherwise we only have the 'type' and 'next' parameters. 'next' tells us the name of the next step
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

// initialize values to first pass in dialog
var isFirst = true;
var dialog_target = "";

/**
 * erase the name provided in the dialog. This is invoked by clicking on a menu option in the index.html page
 */
function eraseName() {document.cookie = "name="; initPage();}

/**
 * startup the dialog
 * @param {String} _target - the name of the html element where text is to be displayed
 */
function startDialog(_target)
{
  // set the prevstep cookie to the start of the dialog
  document.cookie = "prevstep=startDialog";
  // hide the nlc button as we're not yet ready for it
  NLC_Button.hide();
  // create a jQuery object from the passed in string
  dialog_target = $(_target);
  // remove all content from that html element
  dialog_target.empty();
  // if we don't yet know with whom we're speaking, set the dialog to the name step
  if (getCookieValue("name") != "") {document.cookie = "step=name"; nextStep();}
  // otherwise set it to the start step
  else { document.cookie = "step=start"; talkToMe(dialog_target, customDialog['initialize'].message); }
}

/**
 * talk to me ... use the existing text to speech service to talk to the user
 * @param {String} _target - html element to display the provided text
 * @param {String} _string - the text to display
 */
function talkToMe (_target, _string)
{
  // display the provided text
  _target.append('<div class="shape bubble2"><p>'+_string+'</p></div>');
  // call the speech to text function to have Watson talk to you, using the provided string
  speak(_string, a_player_target, false);
}

/**
 * create the visual space for the text bubble
 * @param {String} _step - name of the step we're on
 */
function listenToMe(_step)
{
  // html id's should be unique per web page. If they are not unique, browser behavior is officially undefined.
  // this will make the chat id's unique
    var chat = "chat_"+_step;
    // create a div in the dialog_target (global variable) to hold the output from Watson Speech to Text
    dialog_target.append('<div class="shape bubble1"><p id="'+chat+'">...</p></div>');
    // point the stt_out variable to this newly created <div>
    stt_out = $("#"+chat);
    // tell Watson to start listening
    listen("#"+chat);
}

/**
 * figure out the next step in the conversation. This function uses the JSON custom_dialog object we 
 * created at the top of this file
 */
function nextStep()
{
  // pring a tracking message to the web console showing the previous step and this step
  // the prevstep and step cookie values are set as part of this function, via a call to incrementStep
  console.log("previous step was: "+getCookieValue("prevstep")+" and this step is: "+getCookieValue("step"));
  var step = getCookieValue("step");

  // here we will go through the various steps to determine what to do. 
  // switch/case works by evaluating a constant term (step) against a variety of options (case 'some value':)
  // a case is entered when the value next to the case statement equals the value provided in the switch statement
  // a case is exited when the break; command is encountered. 
  // this means that multiple case statements which require identical processing can be stacked together with a common
  // set of steps and a single break statement. You will see that approach at the very beginning of the following code.
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
      // look for a variety of positive statements in the language of your choice.
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

/**
 * set the document cookies to update the previous and next steps
 * @param {String} _next - the next step in the dialog
 */
function incrementStep(_next)
{
  document.cookie = "prevstep="+getCookieValue("step");
  document.cookie = "step="+_next;
}
