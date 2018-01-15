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
    q_target.empty(); q_target.append("<center><img src='icons/loading.gif' /></center>")
    let _options = {};
    _options.queryString=q_source.val();
    q_source[0].value = "";
    console.log(_method, _options);
    postIt('/discovery/find', _method, display_find, q_target, _options);
  
}
function display_find(_res, _target)
{
  let _str = '<h2>There are<b>'+_res.data.matching_results+'</b> matching results';
  // create a new temporary array
  let tmpArr = new Array();
  // iterate through the results 
  for (each in _res.data.results)
  {(function(_idx, _arr)
    {

  // create a temporary object
  let tmpObj = {};

  // capture extracted_metadat, document id, sentiment, emotion, result_metadata, html
  tmpObj.extracted_metadata = _arr[_idx].extracted_metadata;
      tmpObj.id = _arr[_idx].id;
      tmpObj.sentiment = _arr[_idx].enriched_text.sentiment.document;
      tmpObj.emotion = _arr[_idx].enriched_text.emotion.document.emotion;
      tmpObj.result_metadata = _arr[_idx].result_metadata;
      tmpObj.html = _arr[_idx].html;
      tmpArr.push(tmpObj);
    })(each, _res.data.results);
  }

  // sort on metadata score
  tmpArr.sort(function(a,b){return (b.result_metadata.score > a.result_metadata.score) ? 1 : -1;});

  // clear the target html space
  _target.empty(); 
    for (each in tmpArr)
    { 
      (function(_idx, _array)
      { console.log('_array['+_idx+'] id is: ', _array[_idx].id+' name: '+_array[_idx].extracted_metadata.title+' score: '+_array[_idx].result_metadata.score);

        // build an accordian header
        var _hdr = "find_"+_idx+"_header";
        var _bdy = "find_"+_idx+"_content";
        var _sentiment_icon;
        if (_array[_idx].sentiment.label == "positive") {_sentiment_icon = '<td><img src="/icons/positive.png"></td>';}
        if (_array[_idx].sentiment.label == "neutral") {_sentiment_icon = '<td><img src="/icons/neutral.png"></td>';}
        if (_array[_idx].sentiment.label == "negative") {_sentiment_icon = '<td><img src="/icons/negative.png"></td>';}
        var _link = '<tr><td>Link: </td><td><a href="Documents/Source/'+_array[_idx].extracted_metadata.filename+'" target="_blank"><b>View Original Document</b></a>';
        // since we have this information, let's display the article summary text in the accordian window. 
        // we're using a table format for display purposes, so use both columns to display the text
        var _text = '<tr><td colspan="2">'+_array[_idx].html+'</td></tr>';
        var _hdr_html = '<div class="acc_header off" id="'+_hdr+'" target="'+_bdy+'" onClick="accToggle(\'newsfeed\', \'find_'+_idx+'\');"><table><tr>'+_sentiment_icon+"<td>"+_array[_idx].extracted_metadata.title+'<br/>Score: <b>'+_array[_idx].result_metadata.score+'</b></td></tr></table></div >';

        // build the accordian body
        var _bdy_html = '<div class="acc_body off" id="'+_bdy+'"><table>'+_link+_text+'</table></div>';

        // display it
        _target.append(_hdr_html+_bdy_html);
      })(each, tmpArr);
    }

  // return an empty string to the calling routine
  return('');
}
function getDocName (_docs, _id)
{
  let _name = 'not found';
  for (each in _docs) {(function(_idx, _arr){if (_arr[_idx].id === _id) {_name = _arr[_idx].extracted_metadata.title}})(each, _docs)}
  return(_name);
}
