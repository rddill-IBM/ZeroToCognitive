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
// z2c-alchemy.js
var b_Droppable, _url, _image, droppedFiles, $form, c_res ;
var collections = {
  "water": "water_8fe4c6",
  "collage": "collage_fe9bf8",
  "still": "still_36b472",
  "forest": "forest_2c108f",
  "abstract": "abstract_626032",
  "beach": null,
  "building": null,
  "garden": null
};
var locations = {
  "water": "/images/Landscape/Water/",
  "collage": "/images/Collage/",
  "still": "/images/Still/",
  "forest": "\\images\\Landscape\\Forest\\",
  "abstract": "\\images\\Abstract\\",
  "beach": "\\images\\Landscape\\Beach\\",
  "building": "\\images\\Landscape\\Building\\",
  "garden": "\\images\\Landscape\\Garden\\"
};

var maxSize = 2097152;

function initiateVR()
{
  c_res = $("#classifyResults");
  _url = $("#imageURL");
  _image = $("#image");
  console.log("initiateVR");
  b_Droppable = checkImageDroppable();
  if (b_Droppable)
  {  console.log("browser supports drag and drop: "+b_Droppable);
      droppedFiles= false;
      $form = $('.image')
      var $input    = $form.find('.imageReceiver');
      var droppedFiles = false;
      $form.on('submit', function(e) {
        e.preventDefault();
        if (droppedFiles == false) {c_res.append("<h3>Error: please select a file, first."); return;}
        else
          {if (droppedFiles[0].size > maxSize) {c_res.append("<h3>Error: File size too large. Image must be smaller than 2MB."); return;}
          else
            {if ((droppedFiles[0].type != "image/jpeg") && (droppedFiles[0].type != "image/png")) {c_res.append("<h3>Error: Only jpeg and png files are supported</h3>"); return;}
              else
              {
              c_res.empty(); c_res.append("<center><img src='icons/loading.gif' /></center>");
              var ajaxData = new FormData();
               console.log("processing files: $input.attr('name'): "+ $input.attr('name'));
               ajaxData.append( droppedFiles[0].name, droppedFiles[0] );

               $.ajax({
                 url: $form.attr('action'),
                 type: $form.attr('method'),
                 data: ajaxData,
                 dataType: 'json',
                 cache: false,
                 contentType: false,
                 processData: false,
                 complete: function(data) { displayObjectValues("complete: ", data);
                  displayImageClassificationResults(c_res, data.responseText)},
                 success: function(data) { },
                 error: function(err) { console.log("error: "+err); displayObjectValues("error:", err); }
                });
              }
            }
          }
        });
        _image.on('drag dragstart dragend dragover dragenter dragleave drop',
        function(e) { e.preventDefault(); e.stopPropagation(); });
        _image.on('dragover dragenter', function() {   _image.addClass('dragover'); });
        _image.on('dragleave dragend drop', function() { _image.removeClass('dragover'); });
        _image.on('drop', function(e) { droppedFiles = e.originalEvent.dataTransfer.files;
          console.log("dropped file name: "+droppedFiles[0].name);
          displayObjectValues("droppedFiles[0]: ", droppedFiles[0]);
          var fileSpecs = "<table width='90%'><tr><td>File Name</td><td>"+droppedFiles[0].name+"</td></tr>";
          var tooBig = (droppedFiles[0].size > maxSize) ? " ... File size too large" : "";
          var imageType = ((droppedFiles[0].type == "image/jpeg") || (droppedFiles[0].type == "image/png")) ? "" : " ... Only jpeg and png files are supported";
          fileSpecs += "<tr><td>File Size</td><td>"+droppedFiles[0].size+tooBig+"</td></tr>";
          fileSpecs += "<tr><td>File Type</td><td>"+droppedFiles[0].type+imageType+"</td></tr></table>";
          c_res.empty();
          c_res.append(fileSpecs);
      		var reader = new FileReader();
      		reader.onload = function(e) {
            var __image = '<center><img id="fileToLoad" src="' + e.target.result + '", height=200 /></center>'
            _image.empty();
            _image.append(__image); }
      		reader.readAsDataURL(droppedFiles[0]);
        });
      _image.addClass("dd_upload");
  }
  else {  console.log("browser does not support drag and drop: "+b_Droppable); }
}

function displayImageClassificationResults(_target, _data)
{
  _target.empty();
  console.log("displayImageClassificationResults entered with: "+_data);
  var imageResults = JSON.parse(_data);
  var _tbl = "<table width=90%><tr><th>Image Class</th><th>Probability</th><tr>";
  var _image = imageResults.images[0].image;
  displayObjectValues("ImageResults.images[0]: ", imageResults.images[0]);
  displayObjectValues("ImageResults.images[0].classifiers[0].classes: ", imageResults.images[0].classifiers[0].classes);
  for (each in imageResults.images[0].classifiers[0].classes)
    { (function (_idx, _obj) {
      var _disabled = (collections[_obj[_idx].class] == null) ? ", mic_disabled" : "";
    _tbl += '<tr><td class="col-md-6'+_disabled+'"><a onclick="findInCollection(\''+_image+'\',\''+_obj[_idx].class+'\')" class="btn btn-primary, showfocus">'+_obj[_idx].class+'</a></td><td>'+_obj[_idx].score+'</td></tr>"';
  })(each, imageResults.images[0].classifiers[0].classes)
    }
    _tbl += "</table>";
    _target.append(_tbl);
}

function findInCollection(image, collection)
{
  c_res.empty(); c_res.append("<center><img src='icons/loading.gif' /></center>");
  if(collections[collection] == null) {c_res.append("<p>I'm sorry, but the "+collection+" is not yet available.")}
  console.log("requesting search for image "+image+" in collection: "+collection);
  var options = {};
  options.image = image; options.collection = collections[collection];
  $.when($.post('/images/find', options)).done(function(res){
    console.log(res);
      displayCollectionResults(collection, res);
    });

}
function displayCollectionResults(type, _collection)
{
  c_res.empty();
//  var found = JSON.parse(_collection);
  var found = _collection;
  var sourceName = found.image_file;
  var tableOut = "<table width='95%'><tr><th>Image Name</th><th>Image</th><th>Confidence</th><tr>";
  for (each in found.similar_images)
  {(function(_idx, _obj){
    tableOut += "<tr><td>"+_obj[_idx].image_file+"</td><td><center><img class='showfocus' src='"+locations[type]+_obj[_idx].image_file+"', height=200 /></center></td><td>"+_obj[_idx].score+"</td></tr>";
  })(each, found.similar_images);}
  tableOut += "</table>";
  c_res.append(tableOut);

}
