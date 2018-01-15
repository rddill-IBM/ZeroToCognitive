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
var images = require('./features/images');
var conversations = require('./features/conversations');
var discovery = require('./features/discovery');
var discovery_admin = require('./features/discovery_admin');
var format = require('date-format');

var count = 0;
router.use(function(req, res, next) {
  count++;
  console.log('['+count+'] at: '+format.asString('hh:mm:ss.SSS', new Date())+' Url is: ' + req.url);
  next(); // make sure we go to the next routes and don't stop here
});

module.exports = router;
// speech-to-text
router.get('/api/speech-to-text/token*',speech_to_text.stt_token);
router.get('/api/text-to-speech/synthesize*',speech_to_text.tts_synthesize);

// classify using NLC
router.post('/api/understand/classifyInd*', classifier.classifyInd);

router.post('/auth/authenticate*', auth.authenticate);
router.post('/auth/register*', auth.register);
router.post('/auth/logout*', auth.logout);
router.post('/images/upload', images.upload);
router.post('/images/classify', images.classify);
router.post('/images/find', images.find);

router.post( '/api/response', conversations.response);

router.get('/discovery/getEnvironments', discovery_admin.getEnvironments);
router.get('/discovery/getDocumentList', discovery_admin.getDocumentList);
router.post('/discovery/createEnvironment', discovery_admin.createEnvironment);
router.post('/discovery/listEnvironmentDetails', discovery_admin.listEnvironmentDetails);
router.post('/discovery/getConfigurationDetails', discovery_admin.getConfigurationDetails);
router.post('/discovery/listConfigurations', discovery_admin.listConfigurations);
router.post('/discovery/listCollections', discovery_admin.listCollections);
router.post('/discovery/createCollection', discovery_admin.createCollection);
router.post('/discovery/deleteCollection', discovery_admin.deleteCollection);
router.post('/discovery/getCollectionDetails', discovery_admin.getCollectionDetails);
router.post('/discovery/addDocument', discovery_admin.addDocument);
router.post('/discovery/queryCollection', discovery_admin.queryCollection);
router.post('/discovery/getNews', discovery.getNews);
router.post('/discovery/find', discovery.find);
router.post('/discovery/queryCollection', discovery_admin.queryCollection);
router.post('/discovery/getDocumentDetails', discovery_admin.getDocumentDetails);
