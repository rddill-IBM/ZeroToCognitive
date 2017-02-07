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
function checkNLC(_display, _source)
{
  var options = {};
  options.cquery = _source[0].innerText;
  $.when($.get(_display), $.post('/api/understand/classifyInd', options)).done(function(_page, _nlc_results){
    console.log("page returned");
    var _target= $("#modal");
    _target.append(_page);
    _target.height($(window).height());
    _target.show();
    _data = _nlc_results[0];
    _classes = JSON.parse(JSON.parse(_data).results).classes;
    displayNLC($("#industryResult"), _classes);
    closeNLC=$("#close_NLC");
    closeNLC.on("click", function(){
      console.log("closeNLC clicked.")
      $("#modal").empty();
    });
});
}

function getIndustryClassification(_source, _string)
{

}

function setModal(_display, cbfn, _modalTarget, _results)
{

}

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
