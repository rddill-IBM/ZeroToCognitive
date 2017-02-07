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

exports.response = function(req, res)
{
  var payload = { workspace_id: config.conversations.workspace, context: {}, input: {text: ""} };
  if (req.body) {
    if (req.body.input) { payload.input.text = req.body.input; }
    if (req.body.context) { payload.context = req.body.context; }
  } else {
    return res.send({"error": "Nothing received to process"})}

  conversation.message(payload, function(err, data)
    {
      if (err) {
        return res.status(err.code || 500).json(err); }
      return res.json(data);
    });
}
