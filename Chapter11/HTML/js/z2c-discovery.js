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
// z2c-discovery.js
// browser support for discovery

    let q_source;
    let q_target;

    // initialize the page
function initiateDiscovery()
{   
    let _method = 'initiateDiscovery';
    q_source = $("#textInput");
    q_target = $("#discovery");
}
function doQuery()
{
    let _method = 'doQuery';

    
}
function display_find(_res, _target)
{
  let _str = '<h2>There are<b>'+_res.data.matching_results+'</b> matching results';
  // create a new temporary array
  let tmpArr = new Array();
  // iterate through the results 

  // create a temporary object

  // capture extracted_metadat, document id, sentiment, emotion, result_metadata, html

  // sort on metadata score

  // clear the target html space

  // build an accordian header

  // build the accordian body

  // display it

  // return an empty string to the calling routine
  return('');
}
function getDocName (_docs, _id)
{
  let _name = 'not found';
  for (each in _docs) {(function(_idx, _arr){if (_arr[_idx].id === _id) {_name = _arr[_idx].extracted_metadata.title}})(each, _docs)}
  return(_name);
}
