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
var apiKey = "2533f890b6062529a201a3709967d588f0d0b220";


exports.upload= function(req, res){
  console.log("======> upload entered");
  upload(req, res)
}

exports.classify= function(req, res){

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
      var fileName = filename.replace(/ /g,"_");
      var newFile = path.join(path.dirname(require.main.filename),'images',fileName);
      var fd = fs.openSync(newFile, 'w');
      var fstream = fs.createWriteStream(newFile, {fd: fd});
      file.pipe(fstream);
      fstream.on('close', function () {
        var params = {images_file: fs.createReadStream(newFile), classifier_ids: ["paintings_2143568812"] };
        var visual_recognition = watson.visual_recognition({
          api_key: '320c68ab0bdc14347d353b6350d8fc0207b1ca1b',
          version: 'v3', version_date: '2016-05-20'
        });
        visual_recognition.classify(params, function(err, classify_results) {
          if (err) {console.log(err);}
          else
          {  console.log(JSON.stringify(classify_results, null, 2));
            res.send(classify_results);
          }
        });
      } );
    });
  }

function upload(req, res)
{
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
      var fileName = filename.replace(/ /g,"_");
      var newFile = path.join(path.dirname(require.main.filename),'images',fileName);
      var fd = fs.openSync(newFile, 'w');
      var fstream = fs.createWriteStream(newFile, {fd: fd});
      file.pipe(fstream);
      fstream.on('close', function () { res.send('upload succeeded!');} );
    });
}

exports.find= function(req, res){
    console.log("find entered");

    var imageName = req.body.image.replace(/ /g,"_");
    console.log("imageName "+imageName);
    var newFile = path.join(path.dirname(require.main.filename),'images',imageName);
    console.log("newFile "+newFile);
    var collectionName = req.body.collection;
    console.log("collectionName "+collectionName);
    var params = {image_file: fs.createReadStream(newFile), collection_id: collectionName };
    var visual_recognition = watson.visual_recognition({
      api_key: apiKey,
      version: 'v3', version_date: '2016-05-20'
    });
    visual_recognition.findSimilar(params, function(err, similar_results) {
      if (err) {console.log(err);}
      else
      {  console.log(JSON.stringify(similar_results, null, 2));
        res.send(similar_results);
      }
    });
  }

  function displayObjectValues (_string, _object)
  { for (prop in _object){ console.log(_string+prop+": "+(((typeof(_object[prop]) == 'object') || (typeof(_object[prop]) == 'function'))  ? typeof(_object[prop]) : _object[prop]));} }
