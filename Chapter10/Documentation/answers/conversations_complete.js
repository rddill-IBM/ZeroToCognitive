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
var Watson = require( 'watson-developer-cloud/conversation/v1' );
var config = require("../../env.json");
var conversation = new Watson({
  username: config.conversations.username,
  password: config.conversations.password,
  url: config.conversations.url,
  version_date: '2016-09-20',
  version: 'v1'
});

/**
 * response connects to the previously defined conversation server and sends in the input and context information from the browser
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * req.body.input - text from browser
 * req.body.context - context from browser
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.response = function(req, res)
{
  // set the payload base options
  var payload = { workspace_id: config.conversations.workspace, context: {}, input: {text: ""} };
  // if req.body exists, then check for text and context information. use them if they are present
  if (req.body) {
    if (req.body.input) { payload.input.text = req.body.input; }
    if (req.body.context) { payload.context = req.body.context; }
  } else {
    return res.send({"error": "Nothing received to process"})}

    // connect to the conversation workspace identified as config.conversations.workspace and ask for a response
  conversation.message(payload, function(err, data)
    {
      // return error information if the request had a problem
      if (err) {return res.status(err.code || 500).json(err); }
      // or send back the results if the request succeeded
      return res.json(data);
    });
}
