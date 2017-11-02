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
// displayNLC results
/**
 * This takes the typed in text, sends it to the classifier and then displays the results 
 * @param {String} _display - what page to load to display the results
 * @param {jQuery} _source - a jQuery pointer to the html element with the text to be analyzed
 */
function checkNLC(_display, _source)
{
  // create an empty options object to hold information to send in the post command
  var options = {};
  // get the text from the browser and put it into the options object
  options.cquery = _source[0].innerHTML;
  // get the display page and post the classification request
  $.when($.get(_display), $.post('/api/understand/classifyInd', options)).done(function(_page, _nlc_results){
    console.log("page returned");
    // modal is new in this chapter and allows us to create a partially transparent overlay
    // window to highlight the classification results and prevent other actions until the 
    // classification results page is cleared.
    // 'modal' is a window management term which indicates that other actions are 
    // unavailable while this window, or dialog, is displayed. Calling the target 'modal'
    // does not make this happen, it is actually a result of the CSS associated with this page
    var _target= $("#modal");
    // display the retrieved HTML page
    _target.append(_page);
    // make the height of the 'modal' page the same height as the browser viewable area
    _target.height($(window).height());
    // and then display it. This makes the black, partially transparent page appear.
    _target.show();
    _data = _nlc_results[0];
    // why two JSON.parse commands? Well, somewhere on the server side we stringified twice
    // probably not a good idea
    _classes = JSON.parse(JSON.parse(_data).results).classes;
    // now that the html page we created for viewing the results has been displayed, we
    // can access the html elements on that page
    // so call the displayNCL routine with the target and the returned classes.
    displayNLC($("#industryResult"), _classes);
    // activate the close button
    closeNLC=$("#close_NLC");
    // clear the modal window when the close button is clicked
    closeNLC.on("click", function(){
      console.log("closeNLC clicked.")
      $("#modal").empty();
    });
});
/**
 * format the classes to display in the provided html element
 * @param {String} _target - Jquery object pointing to the html target element
 * @param {Array} _results - the array of results returned by the classifier
 */
}
function displayNLC(_target, _results)
{
  var target = _target;
  // empty all rows from the target (which is an html table) EXCEPT for the first row
  // which is normally a header row that provides titles to all the colums in the table
  target.find("tr:not(:first)").remove();
  // get the classification schema name (which we created in this object on the server)
  indName = _results[0]["class_name"];
  var len = _results.length;
  _idx = 0;
  while (_idx < len)
  {
    // use an anonymous function to populate all the rows in the table. 
    (function(_idx, data)
      {  _cStr = data[_idx]["class_name"];
        target.append("<tr><td style='width: 60%'>"+_cStr +"</td><td>"+data[_idx]["confidence"]+"</td></tr>");})
      (_idx, _results)
    _idx++;
  }
  // close the table.
  target.append("</table>");
}
