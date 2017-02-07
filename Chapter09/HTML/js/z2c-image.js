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
  "forest": "/images/Landscape/Forest/",
  "abstract": "/images/Abstract/",
  "beach": "/images/Landscape/Beach/",
  "building": "/images/Landscape/Building/",
  "garden": "/images/Landscape/Garden/"
};

var maxSize = 2097152;

function initiateVR()
{
  c_res = $("#classifyResults");
  _url = $("#imageURL");
  _image = $("#image");
  b_Droppable = checkImageDroppable();
  if (b_Droppable)
  {  console.log("browser supports drag and drop: "+b_Droppable);

  }
  else {  console.log("browser does not support drag and drop: "+b_Droppable); }
}

function displayImageClassificationResults(_target, _data)
{
  _target.empty();

}

function findInCollection(image, collection)
{
  c_res.empty(); c_res.append("<center><img src='icons/loading.gif' /></center>");

}
function displayCollectionResults(type, _collection)
{
  c_res.empty(); c_res.append("<center><img src='icons/loading.gif' /></center>");

}
