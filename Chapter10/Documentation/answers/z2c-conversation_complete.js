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
// z2c-conversation.js
// browser support for conversation
// display interaction same as in Chapter 6 - custom dialog

// talk to me ... use the existing text to speech service to talk to the user
var _input;
var _conversation;
var _context = {};

/**
 * Initialize the page
 */ 
function initiateConversation()
{
  _input = $("#textInput");
  _conversation = $("#conversation");
  _conversation.empty()
  // start the conversation with Watson
  getResponse("Hi There!");
}

/**
 * get the user's response in the conversation and send it to Watson
 */ 
function getMessage()
 {
   // copy the conversation from the text input box and create a new text bubble with that text
   _conversation.append('<div class="shape bubble1"><p>'+_input.val()+"</p></div>");
   // connect to the server and get the next step
   getResponse(_input.val());
   // empty the text input box
   _input[0].value = "";
}

/**
 * Connect to Watson conversation and get the next step
 * @param {String} _text - text to be sent to Watson
 */ 
function getResponse(_text)
{
  // initialize options
   var options = {};
   options.input = _text;
   options.context = _context;
   // request the next step from our nodejs server
   $.when($.post("/api/response", options)).then(
     function(res, _type, _jqXHR)
     {
       // this function is entered if the request was successful
       console.log("z2c-conversations.js getMessage Success res"+res);
       _conversation.append('<div class="shape bubble2"><p>'+res.output.text+"</p></div>");
     },
   function(res, _type, _jqXHR)
     { 
       // this function is entered if the request was unsuccessful
       console.log("z2c-conversations.js getMessage Failure res.responseText"+res.responseText);
      _conversation.append('<div class="shape bubble2"><p>'+res.responseText+"</p></div>");
     });
 }
