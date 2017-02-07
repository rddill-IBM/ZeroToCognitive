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
var express = require('express');
var router = express.Router();
var speech_to_text = require('./features/speech_to_text');
var classifier = require('./features/classifier');
var auth = require('./features/authenticate');

module.exports = router;
// speech-to-text
router.get('/api/speech-to-text/token*',speech_to_text.stt_token);
router.get('/api/text-to-speech/synthesize*',speech_to_text.tts_synthesize);

// classify using NLC
router.post('/api/understand/classifyInd*', classifier.classifyInd);

router.post('/auth/authenticate*', auth.authenticate);
router.post('/auth/register*', auth.register);
router.post('/auth/logout*', auth.logout);
