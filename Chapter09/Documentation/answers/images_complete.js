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
var vr_classifier = require("../../env.json").vr_classifier_id;


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
  req.busboy.on('file', function(fieldname, file, filename) {
    // not all file systems are friendly to names with spaces in them. 
    // if this name has spaces in it, replace them with an underscore. 
      var fileName = filename.replace(/ /g,"_");
      var newFile = path.join(path.dirname(require.main.filename),'images',fileName);
      var fd = fs.openSync(newFile, 'w');
      var fstream = fs.createWriteStream(newFile, {fd: fd});
      file.pipe(fstream);
      // now that we have the image stored on the server, send it to watson
      fstream.on('close', function () {
        var params = {images_file: fs.createReadStream(newFile), classifier_ids: [vr_classifier] };
        var visual_recognition = watson.visual_recognition({
          api_key: apiKey,
          version: 'v3', version_date: '2016-05-20'
        });
        visual_recognition.classify(params, function(err, classify_results) {
          // if there is an error, log it. 
          // this should be extended to include a res.send() so the browser does not repeat the request
          // which it will do on requests with no response
          if (err) {console.log(err);}
          else
          // the request was successful, send the results back to the browser
          {   res.send(classify_results); }
        });
      } );
    });
  }

/**
 * find looks in a collection of images to find those images which most closely match the provided image
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * req.body.collection - the id of the collection to use
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.find= function(req, res, next){
  // get rid of blanks in the file name
    var imageName = req.body.image.replace(/ /g,"_");
    var newFile = path.join(path.dirname(require.main.filename),'images',imageName);
    // save the collection name
    var collectionName = req.body.collection;
    // read in the (previously transferred) file name
    var params = {image_file: fs.createReadStream(newFile), collection_id: collectionName };
    // set the visual_recognition parameters
    var visual_recognition = watson.visual_recognition({
      api_key: apiKey,
      version: 'v3', version_date: '2016-05-20'
    });
    // request similar images
    visual_recognition.findSimilar(params, function(err, similar_results) {
      // on error, log the erro
      if (err) {console.log(err);}
      else
      // send the results back to the browser
      {res.send(similar_results);}
    });
  }
