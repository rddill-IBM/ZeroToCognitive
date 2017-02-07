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
// z2c-conversion.js
// browser support for conversation
// display interaction same as in Chapter 6 - custom dialog

var _conversionList;
var _documentSource = "/IBV_Documents/ibv.json";
var _documentList;
var _convertedSource = "IBV_Conversion/";
var combineButton; var rankingDocs = {};

// initialize the page
function initiateConversion()
{
  _conversionList = $("#conversionList");
  _conversionList.empty();
  loadList(_documentSource);
}

// The loadList function loads the documents to be converted into the 'conversionList' HTML object.
// This function would be enhanced if, instead of directly accessing the document list file, it called a service on the nodejs server
// to retrieve that file. This would accomplish two important objectives:
// (1) it would provide better seperation of concerns between the browser and the server and
// (2) it would enable you to check on the server to see which json files have already been completed.
// you could accomplish objective (2) by
// This could be determined by iterating through the ibv.json file and using fs.existsSync (https://nodejs.org/api/fs.html#fs_fs_existssync_path)
// to determine if the conversion has already been completed. The result of the query could be used to add an additional element to each row
// in the json file before it is sent to the browser.
function loadList(_documentSource)
{
  // if you were to implement the service mentioned above, the following line would need to be changed
  // so that _documentSource points to your new 'api/...' service
  $.when($.get(_documentSource)).done(function(list){
    _documentList = list;
    _conversionList.empty();
    var _table = "<table width='100%'><tr><th>Process?</th><th>Name</th><th>Page URL</th><th>Converted?</th><th>Add?</th></tr>";
    for (each in list.IBV) {(function(_idx, _list){
      var _button = "<center><a id='convert_"+_idx+"' class='btn btn-primary' style='padding: 0.3em; margin: .5em' onClick=\"convert('"+_list[_idx].file+"', 'complete_"+_idx+"', 'add"+_idx+"')\">Convert "+_list[_idx].file+"</a></center>";
      var _link = "<a href='"+_list[_idx].pageURL+"'>"+_list[_idx].pageURL+"</a>";
      // if you implement the new service, you would insert some if statements here to check if the document already exists
      // if the document exists, add the checkmark gif image to the 'complete' table data element and the 'add' button to the 'add' table data element.
      _table+="<tr class='showfocus'><td >"+_button+"</td><td><center>"+_list[_idx].name+"</center></td><td>"+_link+"</td><td id='complete_"+_idx+"'></td><td id='add"+_idx+"'></td> </tr>";
    })(each, list.IBV);}
    _table+="</table>";
    _conversionList.append(_table);
  });
  combineButton = $("#combine");
  combineButton.on('click', function(){buildCombined();});
}

// the convert function executes a call to the convert service, sending in the name of the document to be converted.
function convert(_file, _icon, _button)
{
  _iconPlace = $("#"+_icon);
  _buttonPlace = $("#"+_button);
  _iconPlace.empty(); _buttonPlace.empty();
  _iconPlace.append("<center><img src='icons/loading.gif' height='32px'/></center>");

    var options = {"fileName": _file};
    var fileOut = _file.split('.')[0]+".json";
    $.when($.post("/api/convert", options)).done(function (res)
  {
    _iconPlace.empty();
    _iconPlace.append("<center><a href='"+_convertedSource+fileOut+"' target='_blank'><img src='icons/checkmark_24.gif' /></a></center>");
    _buttonPlace.append("<center><a class='btn btn-primary' style='padding: 0.3em; margin: .5em' onClick=\"addToCollection('"+fileOut+"')\">Add To Collection</a></center>");
  });
}

// The addToCollection function performs two functions.
// First, it verifies that the file to be added exists by retrieving it from the server using the $.get jQuery call.
/// it then iterates through the file, printing the title of each answer unit to the browser console.log
// Second, it then posts to the server /api/add the name of the file to be added.
//
// this routine is called on the convert page once the document conversion process has completed.
// I recommend that you read and follow the changes to the server code and then call this function
// only once, using the combined document file rather than each individual file.
function addToCollection (_file)
{
  console.log("addtoCollection entered with "+_file);
  var options = {"fileName": _file};
  $("#sampleOut").empty();
  $("#sampleOut").append("<p>Converting "+_file+" to solr format</p>");
  // this routine, from lines 98 to 105 inclusive, can be removed with no effect on program logic. they are debug only
  $.when($.get(_convertedSource+'/'+_file)).done(function(res_json)
  {
    res_json.source_document_id=_file;
    var count = res_json.answer_units.length;
    var answer_units = res_json.answer_units;
    $("#sampleOut").append("<p>Adding "+_file+" to collection</p>");
    for (each in answer_units) { console.log("["+each+"] title: "+answer_units[each].title);}
  });
  // this is the working part of the code, which tells the server what file to add to the solr collection
  $.when($.post("/api/add", options)).done(function (res)
    {
      $("#sampleOut").append("<p> "+_file+" conversion complete and added to collection</p>");
      $("#sampleOut").append(res);
    });
}

// The buildCombined function tells the server to create a single file from all of the existing {document}.json files.
// This combined file is used on the 'review document sections' web page
function buildCombined()
{
  var options = {};
  $.when($.post('/api/buildCombined')).done(function(res){
    $("#sampleOut").empty();
    $("#sampleOut").append(res);
  })
}

// The initiateRanking function sets up the Ranking HTML page for execution
function initiateRanking()
{
  var _resetSelection = $("#resetSelection");
  var _saveQuestion = $("#saveQuestion");
  _resetSelection.on('click', function(){resetRanking();});
  _saveQuestion.on('click', function(){saveQuestion();});
  // the loadDocList function is used on two different pages. On the ranking page, the left hand column needs to contain a numeric input field
  // so the loadDocList function is called with a parameter of 'number'
  loadDocList("number");
}

// The resetRanking function is called from the ranking questions web page and resets all number input fields to blanks.
function resetRanking()
{
  for (each in rankingDocs)
  {(function(_idx, _array){$("#"+_array[_idx].id).val('');})(each, rankingDocs);}
}

// The saveQuestion function reads the question typed into the text input field and then appends that question with
// the id and number from each row in the table which has a value greater than 0.
// a blank is treated as a zero.
//
// This routine would be vastly improved if the text input field were checked to make sure that it has content
// and return an error message prior to process the save question function if the text input field is empty.
function saveQuestion()
{
  var _source = $("#rankingQuestion");
  var question = _source.val().replace(/,/g,"");
  console.log("saveQuestion: "+question);
  _source[0].value="";
  for (each in rankingDocs)
  {(function(_idx, _array){
    var ranked = $("#"+_array[_idx].id).val();
    if (ranked > 0) {question+=", "+_array[_idx].id+", "+ranked;}
  })(each, rankingDocs);}
  console.log(question);
  var options = {question: question};
  $.when($.post('/api/saveQuestion', options)).done(function(res)
  {
    $("#status").empty();
    $("#status").append(res);
    resetRanking();
  });
}

// The initiateDocReview function is called once the document section review page has been loaded
function initiateDocReview()
{
  var _resetDocSelection = $("#resetDocSelection");
  var _saveDocSelection = $("#saveDocSelections");
  _resetDocSelection.on('click', function(){resetDocRanking();});
  _saveDocSelection.on('click', function(){saveDocSelection();});
  // the loadDocList function is used on two different pages. On the ranking page, the left hand column needs to contain a checkbox
  // so the loadDocList function is called with a parameter of 'checkbox'
  loadDocList("checkbox");
}

// the resetDocRanking function is called to remove all changes and mark all document sections as selected.
// if a checkbox is selected, then that document section remains in the final doclist.json file.
function resetDocRanking()
{  for (each in rankingDocs)
  {(function(_idx, _array){$("#"+_array[_idx].id).prop("checked", true);})(each, rankingDocs);}
}

// The saveDocSelection function is called to read through the current selections and build a new json file with only those document sections
// which still have a checkmark in column 1
function saveDocSelection()
{
  var _newList = "[";
  var _count = 0;
  for (each in rankingDocs)
  {(function(_idx, _array)
    { var _comma = (_count==0) ? "" : ", "; _count++;
      if ($("#"+_array[_idx].id).is(':checked'))
    { _newList += _comma+"\n"+JSON.stringify(_array[_idx]);} })(each, rankingDocs);
  }
  _newList += "]";
  var saveList = JSON.parse(_newList);
  rankingDocs = saveList;
  var options = {"newList": _newList};
  $.when($.post("/api/updateDocList", options)).done(function(res)
  {
    $("#status").empty();
    $("#status").append(res);
    loadDocList("checkbox");
  });
}

// The loadDocList function is used on two different pages and accepts an input of eiher number or checkbox.
// and then creates the appropriate type of input field in the first column of the dsiplayed table.
function loadDocList(_type)
{
  var _target = $("#docRanker");
  _target.empty();
  var _str = "<table width='100%'><tr><th>Rank<br/>Zero means ignore</th><th>Document </th><th>Title<br/>Hover over title to see description</th></tr>";
  $.when($.get('/api/getDocList')).done(function(docList)
  {
    rankingDocs = JSON.parse(docList);
    for (each in rankingDocs)
    {(function(_idx, _array)
      { var rVal = "";
        switch(_type)
        { case 'number':
            rVal = "<input type='number' min='0' max='10' value='' id='"+_array[_idx].id+"'    title='Enter a ranking value between 1 and 10. Zero (0) means ignore this item'/>";
            break;
          case 'checkbox' :
            rVal = "<input type='checkbox' id='"+_array[_idx].id+"' checked=true title='deselect this item to remove it from the list'/>";
            break;
        }
        _str += "<tr width='100%' class='showFocus'><td>"+rVal+"</td><td>"+_array[_idx].fileName+"</td><td title='"+_array[_idx].body+"'>"+_array[_idx].title+"</td></tr>";
      })(each, rankingDocs);}
      _str +="</table>";
      _target.append(_str);
  });
}

// The initiateFind function is used to set up the compare Retrieve and Rank web page.
function initiateFind()
{
  console.log("initiateFind");
  var _askQuestion = $("#askQuestion");
  var _question = $("#question");
  _askQuestion.on('click', function(){find(_question.val()); _question[0].value="";});
}

// The find function is called when the button has been pressed on the compare retrieve and rank page.
//
// This routine would be vastly improved if the text input field were checked to make sure that it has content
// and return an error message prior to process the save question function if the text input field is empty.
function find(_string)
{
  var options = {question: _string};
  $.when($.post('/api/search', options), $.post('/api/find', options)).done(function(resNR, resR){displayFound(resNR, resR);});
}

// The displayFound function is called when the find routine completes and, in tur, calls the displaySearchRes function twice.
// The first parameter is the result set from the search and find operations
// the second parameter is the HTML object which is to receive the formatted results.
function displayFound(_resNR, _resR)
{
  displaySearchRes(_resNR[0], "unrankedAnswers");
  displaySearchRes(_resR[0], "rankedAnswers");
}

// The initiateRetrieve function is called when the askQuestion.html page has been loaded.
function initiateRetrieve()
{
  console.log("initiateFind");
  var _askQuestion = $("#askQuestion");
  var _question = $("#question");
  _askQuestion.on('click', function(){retrieve(_question.val()); _question[0].value="";});
}

// The retrieve function is called when the button is pressed on the askQuestion.html page.
//
// This routine would be vastly improved if the text input field were checked to make sure that it has content
// and return an error message prior to process the save question function if the text input field is empty.
function retrieve(_string)
{
  var options = {question: _string};
  $.when($.post('/api/search', options)).done(function(resNR){displaySearchRes(resNR, "answers");});
}

// The displaySearchRes function receives as parameter 1 the result from a Watson Retrieve call or a Watson Rank call
// and as paramter 2 the HTML object which is to receive the formatted results.
// This routine currently iterates through the entire result set and then lists results grouping document sections by source document.
// This means that it is, as a side effect, changing the retrieve and also the rank order.
//
// This routine can be significantly simplified iif it simply lists the restults out in the order received.
// Doing so will have the added benefit of preserving the results of the Watson Ranking call
// and is recommended as an exercise for you.
function displaySearchRes(_res, _pos)
{
  var _target = $("#"+_pos);
  _target.empty();
  var docArray = [];
  var tmpDocs = _res.docs;
  for (each in _res.docs)
  {(function(_idx, _array)
    {if (docArray.length == 0)
      {docArray[0]=_array[_idx].id}
      else { var idx = 0; var bFound = false;
        while (idx < docArray.length)
        { if (docArray[idx]==_array[_idx].id){bFound = true;} idx++;}
        if (bFound != true) {docArray[docArray.length]=_array[_idx].id;}
      }
    })(each, _res.docs)
  }
  // then find responses by doc/page
  // and create an object array for each document
  var docArray2 = {};
  for (each in _res.docs)
  {(function(_idx, _array)
    {var idx = 0; var idxFound = -1;
      while (idx < docArray.length)
        {(function(_idx2)
          {if (docArray[_idx2]==_array[_idx].id)
            {iFound = _idx2;}})(idx);
          idx++;
        }
        var _comma;
        if (typeof(docArray2[iFound]) == 'undefined') {docArray2[iFound]=""; _comma = "";}
        else {_comma = ", ";}
       docArray2[iFound]+=_comma+JSON.stringify(_array[_idx]);
    })(each, _res.docs)
  }
  for (each in docArray2)
  { (function(_each, _docArray2)
    {var docArray3 = JSON.parse("["+_docArray2[_each]+"]");
    for (row in docArray3)
    {(function(_idx, _array)
      { console.log("_array["+_pos+"_"+_each+"_"+_idx+"].filename is: "+_array[_idx].fileName);
        var _hdr = "answers_"+_pos+"_"+_each+"_"+_idx+"_header";
        var _bdy = "answers_"+_pos+"_"+_each+"_"+_idx+"_content";
        var _hdr_html = '<div class="acc_header off" id="'+_hdr+'" target="'+_bdy+'" onClick="accToggle(\''+_pos+'\', \'answers_'+_pos+"_"+_each+"_"+_idx+'\');"><table width="100%"><tr><td margin=".5em"><a href="IBV_Documents/'+_array[_idx].fileName+'" target="_blank">'+_array[_idx].fileName+'</a></td><td margin=".5em"><center>'+_array[_idx].title+'</center></td></tr></table></div >';
        var _bdy_html = '<div class="acc_body off" id="'+_bdy+'">'+_array[_idx].body+'</div>';
        _target.append(_hdr_html+_bdy_html);
      })(row, docArray3);}
    })(each, docArray2);
  }
}
