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
var fs = require('fs-extra');
var path = require('path');
var busboy = require('connect-busboy');
var watson = require('watson-developer-cloud');
var request = require('request');
var apiKey = require("../../env.json").visual_recognition.api_key;
var vr_classifier = require("../../env.json").visual_recognition.classifier_id;


/**
 * upload transfers the designated file from the browser to the server
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.upload= function(req, res, next){
  console.log("======> upload entered");
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    // not all systems are friendly when there are spaces in a file name. 
    // if we find any, replace them with an underscore
      var fileName = filename.replace(/ /g,"_");
      var newFile = path.join(path.dirname(require.main.filename),'images',fileName);
      var fd = fs.openSync(newFile, 'w');
      var fstream = fs.createWriteStream(newFile, {fd: fd});
      file.pipe(fstream);
      fstream.on('close', function () { res.send('upload succeeded!');} );
    });
}

/**
 * classify saves the provided image and then sends that image to watson for classification
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.classify= function(req, res, next){

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) 
  {
    // not all file systems are friendly to names with spaces in them. 
    // if this name has spaces in it, replace them with an underscore. 
    var fileName = filename.replace(/ /g,"_");
    var newFile = path.join(path.dirname(require.main.filename),'images',fileName);
    var fd = fs.openSync(newFile, 'w');
    var fstream = fs.createWriteStream(newFile, {fd: fd});
    var _res = {};
    file.pipe(fstream);
    // now that we have the image stored on the server, send it to watson
    fstream.on('close', function () 
    {
      var params = {images_file: fs.createReadStream(newFile), classifier_ids: [vr_classifier] };
      var visual_recognition = watson.visual_recognition(
      {
        api_key: apiKey,
        version: 'v3', version_date: '2016-05-20'
      });
      visual_recognition.detectFaces(params, function(err, faces) 
      {
        if (err) {console.log(err); res.send({'results': 'failed', 'where': 'detectFaces', 'error': err});}
        else 
        {
          console.log('detecFaces successful: '+JSON.stringify(faces)); _res.faces = faces;
          var params = {images_file: fs.createReadStream(newFile), classifier_ids: [vr_classifier] };
          visual_recognition.classify(params, function(err, classify_results) 
          {
            if (err) {console.log(err); res.send({'results': 'failed', 'where': 'classify', 'error': err});}
            else 
            {
              console.log('classify successful: '+JSON.stringify(classify_results)); _res.classify = classify_results;
              res.send({'results': 'success', 'data': _res});
            }
          });
        }
      });
    });
  });
}

/**
 * detect faces looks at an image to find the faces in it
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.detect= function(req, res, next){
  // get rid of blanks in the file name
    var imageName = req.body.image.replace(/ /g,"_");
    var newFile = path.join(path.dirname(require.main.filename),'images',imageName);
    // read in the (previously transferred) file name
    var params = {image_file: fs.createReadStream(newFile), collection_id: collectionName };
    // set the visual_recognition parameters
    var visual_recognition = watson.visual_recognition({
      api_key: apiKey,
      version: 'v3', version_date: '2016-05-20'
    });
    // request face recognition
    visual_recognition.detectFaces(params, function(err, response) {
     // on error, log the erro
      if (err) {console.log(err); res.send({'results': 'failed', 'where': 'detectFaces', 'error': err});}
      else
      // send the results back to the browser
      {console.log(JSON.stringify(response)); res.send({'results': 'success', 'data': response});}
    });
  }
