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
 * format the classes to display in the provided html element
 * @param {String} _target - Jquery object pointing to the html target element
 * @param {Array} _results - the array of results returned by the classifier
 */
var industryTable = "#industryResult";
var nlc_classes; var industryPage="displayNLC.html";

function displayNLC(_target, _results)
{
  var target = _target;
  target.find("tr:not(:first)").remove();
  indName = _results[0]["class_name"];
  var len = _results.length;
  _idx = 0;
  while (_idx < len)
  {
    (function(_idx, data)
      {  _cStr = data[_idx]["class_name"];
        target.append("<tr><td style='width: 60%'>"+_cStr +"</td><td>"+data[_idx]["confidence"]+"</td></tr>");})
      (_idx, _results)
    _idx++;
  }
  target.append("</table>");
}

/**
 * This is a rewrite of the checkNLC function from the previous chapter to integrated the 
 * checking process into the custom dialog for this chapter and to save the classification results
 * for later display, should the user choose that option
 * @param {String} _target - Jquery object pointing to the html target element
 * @param {Array} _results - the array of results returned by the classifier
 */
function getIndustryClassification(_source, _string)
{
  var options = {};
  options.cquery = _source[0].innerText;
  $.when( $.post('/api/understand/classifyInd', options)).done(function(_nlc_results){
    _data = _nlc_results;
    nlc_classes = JSON.parse(JSON.parse(_data).results).classes;
    industry = nlc_classes[0].class_name;
    toggle_mic(_mic, _stop, false)
    talkToMe(dialog_target, _string.format(getCookieValue("name"), industry));
  });
}

/**
 * This function extracts the code which created the 'modal' window in the previous chapter and
 * and puts it into a new function. The major change to the logic in this routine is the
 * addition of the 'cbfn' parameter. cbfn is an abbreviation which I use to indicate that this
 * is a CallBackFuNction. That is, when setModal is called, it expects a function name to be
 * passed in as a parameter. That function is called when the modal pattern is in place; in the
 * logic of this application, the callback function will be the displayNLC results logic.
 * This approach allows us to use the displayNLC logic without change (lower short and long term maintenance).
 * @param {String} _display - html page to load
 * @param {javascript function name} cbfn - the callback function to invoke when complete
 * @param {String} _modalTarget - Jquery object pointing to the html target element
 * @param {Array} _results - the array of results returned by the classifier
 */
function setModal(_display, cbfn, _modalTarget, _results)
{
  $.when($.get(_display)).done(function(_page){
    var _target= $("#modal");
    _target.append(_page);
    _target.height($(window).height());
    _target.show();
    closeNLC=$("#close_NLC");
    closeNLC.on("click", function(){
      $("#modal").empty();
      nextStep();
    });
    // new to this chapter, invoke the callback function which was passed in to this
    // routine when it was invoked.
    cbfn($(_modalTarget), _results);
  });
}
