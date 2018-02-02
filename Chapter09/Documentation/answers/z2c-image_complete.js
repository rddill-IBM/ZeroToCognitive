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
// z2c-images.js
var b_Droppable, _url, _image, droppedFiles, $form, c_res ;

// visual recognition has an image limit of 2Mb
var maxSize = 2097152;
var _factor;

/**
 * initialize the visual recognition page.
 */
function initiateVR()
{
  c_res = $("#classifyResults");
  _url = $("#imageURL");
  _image = $("#image");
  console.log("initiateVR");
  // using the checkImageDroppable function in z2c-utilities.js, ensure that the browser supports drag and drop operation
  b_Droppable = checkImageDroppable();
  if (b_Droppable)
  {  console.log("browser supports drag and drop: "+b_Droppable);
      // initialize variables
      droppedFiles= false;
      $form = $('.image')
      var $input    = $form.find('.imageReceiver');
      var droppedFiles = false;
      // the image receiver is inside an html <form> object
      $form.on('submit', function(e) {
        e.preventDefault();
        // the submit button was clicked, but no file was dropped or selected
        if (droppedFiles == false) {c_res.append("<h3>Error: please select a file, first."); return;}
        else
        // files have a max size of 2Mb
          {if (droppedFiles[0].size > maxSize) {c_res.append("<h3>Error: File size too large. Image must be smaller than 2MB."); return;}
          else
          // only jpeg and png files are supported .... well, it works with gif, too, just not as well
            {if ((droppedFiles[0].type != "image/jpeg") && (droppedFiles[0].type != "image/png")) {c_res.append("<h3>Error: Only jpeg and png files are supported</h3>"); return;}
              else
              {
                // everything is good. let's proceed
                // display a busy icon
              c_res.empty(); c_res.append("<center><img src='icons/loading.gif' /></center>");
              // get the image data
              var ajaxData = new FormData();
               console.log("processing files: $input.attr('name'): "+ $input.attr('name'));
               ajaxData.append( droppedFiles[0].name, droppedFiles[0] );
                // ajax is asynchronous javascript execution. Send the request to the server
                // let the browser do other things
                // then respond when the server returns
               $.ajax({
                 url: $form.attr('action'),
                 type: $form.attr('method'),
                 data: ajaxData,
                 dataType: 'json',
                 cache: false,
                 contentType: false,
                 processData: false,
                 // wait until everything comes back, then display the classification results
                 complete: function(data) { displayImageClassificationResults(c_res, data.responseText)},
                 success: function(data) { },
                 // oops, there was an error, display the error message
                 error: function(err) { console.log("error: "+err); displayObjectValues("error:", err); }
                });
              }
            }
          }
        });
        // don't do any default processing on drag and drop
        _image.on('drag dragstart dragend dragover dragenter dragleave drop',
        function(e) { e.preventDefault(); e.stopPropagation(); });
        // change how the drag target looks when an image has been dragged over the drop area
        _image.on('dragover dragenter', function() {   _image.addClass('dragover'); });
        // remove drag target highlighting when the mouse leaves the drag area
        _image.on('dragleave dragend drop', function() { _image.removeClass('dragover'); });
        // do the following when the image is dragged in and dropped
        _image.on('drop', function(e) 
        {
          droppedFiles = e.originalEvent.dataTransfer.files;
          console.log("dropped file name: "+droppedFiles[0].name);
          // build a table to display image information
          var fileSpecs = "<table width='90%'><tr><td>File Name</td><td>"+droppedFiles[0].name+"</td></tr>";
          // check image size
          var tooBig = (droppedFiles[0].size > maxSize) ? " ... File size too large" : "";
          // check image type
          var imageType = ((droppedFiles[0].type == "image/jpeg") || (droppedFiles[0].type == "image/png")) ? "" : " ... Only jpeg and png files are supported";
          fileSpecs += "<tr><td>File Size</td><td>"+droppedFiles[0].size+tooBig+"</td></tr>";
          fileSpecs += "<tr><td>File Type</td><td>"+droppedFiles[0].type+imageType+"</td></tr></table>";
          // clear the target
          c_res.empty();
          // display the table
          c_res.append(fileSpecs);
          // load the image to get the original size of the inbound image. 
          // we need this information to correctly draw a box around the face later on.
      		var reader = new FileReader();
      		reader.onload = function(e) {
            var __image = '<img id="fileToLoad" src="' + e.target.result + '", height=200 />'
            _image.empty();  _image.append(__image); _image.hide();
            var _img = $("#fileToLoad");
            window.setTimeout(function()
            {
              // the display window is 200 pixels high. calculate the multiplication factor to fit this window and save it for later use
              _factor = 200/_img[0].naturalHeight;
              // calculate the target width
              var _width = _factor*_img[0].naturalWidth; 
              var _height = 200;
              // create a drawing canvas and center it in the imageReceiver div
              __image = '<center><canvas id="fileCanvas" width="'+_width+'" height="'+_height+'"></canvas></center>'
              // empty the div of the image we just loaded and append this canvas to the now empty div
              _image.empty(); _image.append(__image); 
              // get the drawing context for the canvas
              var ctx = $("#fileCanvas")[0].getContext("2d");
              // create a drawable image
              var imageObj = new Image();
              // link the source to the image dropped on the imageReceiver div
              imageObj.src = e.target.result;
              // when the image has loaded into memory, draw it
              imageObj.onload = function () {
                ctx.drawImage(imageObj, 0, 0, _width, _height);
              }
              _image.show();
              }, 100);
          }
      		reader.readAsDataURL(droppedFiles[0]);
        });
        // update the image area css
      _image.addClass("dd_upload");
  }
  // sorry, but your browser does not support drag and drop. Time to finally do that upgrade?
  else {  console.log("browser does not support drag and drop: "+b_Droppable); }
}

/**
 * display the results of the image classification process
 * @param {String} _target - the html element to receive the results
 * @param {String} _data - the image information to display
 */
function displayImageClassificationResults(_target, _data)
{
    // empty the html target area
    _target.empty();
    // turn the returned string back into a JSON object
    var imageResults = JSON.parse(_data);
    // check to see if the request for face detection and clssification were both successful
    if (imageResults.results !== 'success')
    {
      _target.append('Visual Recognition failed at: '+imageResults.where+' with error: <br/>'+imageResults.err.message);
      return;
    }
    // check to make sure that there was at least one face in the provided image
    if (imageResults.data.faces.images[0].faces.length === 0)
    {
      _target.append('There is no face in the provided image: '+imageResults.data.faces.images[0].image);
      return;
    }
    else
    {
      // get the rectangle of the first face found in the image
      var _imgRect = imageResults.data.faces.images[0].faces[0].face_location;
      // the top value provided is consistently about 1.3 times the actual vertical offset of the face
      // the following correction factor is to address that bug
      var vert_correction = 0.3;
      // get the drawing context of the canvas
      var ctx = $("#fileCanvas")[0].getContext("2d");
      // create a rectangle to fit around the face
      ctx.rect(_factor*_imgRect.left, vert_correction*_factor*_imgRect.top, _factor*_imgRect.width, _factor*_imgRect.height);
      // set the line width to 6 pixels
      ctx.lineWidth="6";
      // set the line color to blue
      ctx.strokeStyle="blue";
      // draw the rectangle.
      ctx.stroke(); 

    }

    // create a display table
    var _tbl = "<table width=90%><tr><th>Image Class</th><th>Probability</th><tr>";

    var _image = imageResults.data.classify.images[0].image;
    // iterate through the classification results, displaying one table row for each result row
    if (imageResults.data.classify.images[0].classifiers.length === 0)
    { _tbl += "<tr><td>No Results with higher than 50% probability</td></tr>"}
    else
    {
      for (each in imageResults.data.classify.images[0].classifiers[0].classes)
      {
        (function (_idx, _obj) {
        _tbl += '<tr class="showFocus"><td class="col-md-6"><b>'+_obj[_idx].class+'</b></td><td>'+_obj[_idx].score+'</td></tr>';
        })(each, imageResults.data.classify.images[0].classifiers[0].classes)
      }
    }
    // close the table
    _tbl += "</table>";
    // and append it to the target.
    console.log(_tbl);
    _target.append(_tbl);
}
