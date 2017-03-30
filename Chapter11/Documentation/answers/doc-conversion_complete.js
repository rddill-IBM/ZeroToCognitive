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
// doc-conversion.js
// train.py -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF -i rankingQuestions.csv -c sc2c46ac51_4d85_4b7e_b642_a73b44f65cc5 -x IBVArticles -r 5 -n z2cChapter11
// curl -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF  "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/rankers/76643bx23-rank-282"
// curl -X POST -u 852ca667-52f3-47d8-af7d-eb1b81004a89:QdKJNvEiDpBF  "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc2c46ac51_4d85_4b7e_b642_a73b44f65cc5/solr/IBVArticles/select?q=what%20critical%20issues%20are%20CEOs%20facing%20today&wt=json&fl=id,title"

var watson = require('watson-developer-cloud');
var fs = require('fs');
var env = require("../../env.json");
var path = require('path');
var qs = require('qs');


var document_conversion = watson.document_conversion({
  username:     env.documentConversion.username,
  password:     env.documentConversion.password,
  version:      'v1',
  version_date: '2015-12-15'
});

var retrieve_and_rank = watson.retrieve_and_rank({
  username: env.retrieveAndRank.username,
  password: env.retrieveAndRank.password,
  version: 'v1'
});
var params = {
  cluster_id: env.retrieveAndRank.cluster_id,
//  config_name: env.retrieveAndRank.config_name,
  collection_name: env.retrieveAndRank.collection_name,
  wt: 'json'
};
// custom configuration
var config = {
      "pdf": { "heading": { "fonts":
        [
          {"level": 1, "min_size": 24, "max_size": 80},
          {"level": 2, "min_size": 18, "max_size": 24, "bold": false, "italic": false},
          {"level": 2, "min_size": 18, "max_size": 24, "bold": true},
          {"level": 3, "min_size": 13, "max_size": 18, "bold": false, "italic": false},
          {"level": 3, "min_size": 13, "max_size": 18, "bold": true},
          {"level": 4, "min_size": 11, "max_size": 13, "bold": true, "italic": false}
        ] } },
    "conversion_target": 'ANSWER_UNITS'
      };

// the convert service accepts an inbound document and creates a json file representing the sections of that inbound document.
// the service is based on the assumption that the document to be loaded is already stored in the local server.
// should you want to receive an inbound file from the the browser, then use the file upload routine from Chapter 9
exports.convert = function(req, res)
{
  var fileIn = req.body.fileName
  // this sets us up to read a copy of the requested pdf from our local system. The set of available files is defined in the
  // "ibv.json" file in the IBV_Documents folder.
  //
  // If you want to read a pdf directly from the web, then you would need to use the "documentURL" element instead of "fileIn"
  //
  // if you want to read a set of html pages, then you would need to change the ibv.json file to capture the pages you want and, in the current structure
  // use the "pageURL" element. In this case, you would also need to review the config object (lines 46 & following above) to ensure that it correctly represents your page structure

  var newInputFile = path.join(path.dirname(require.main.filename),env.documentConversion.source_path,fileIn);
  var fileOut = fileIn.split('.')[0]+".json";
  var newOutputFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,fileOut);
  document_conversion.convert({
    file: fs.createReadStream(newInputFile),
    conversion_target: 'ANSWER_UNITS',
    config: config
  }, function (err, response) {
    if (err) {console.error(err); res.send(err);}
    else {
      response.source_document_id=fileIn;
      fs.writeFile(newOutputFile, JSON.stringify(response, null, 2), function()
      {console.log("file save completed to: "+newOutputFile);});
      res.send(response);
    }
  });
}

// the add service takes an already converted file (from the convert service) and adds it to the solr collection.
exports.add = function(req, res)
{
  var fileIn = req.body.fileName
  var newInputFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,fileIn);
  var solrClient = retrieve_and_rank.createSolrClient(params);
  var doc = formatForSolr(fs.readFileSync(newInputFile), fileIn);
  console.log('Indexing a document...');
  solrClient.add(doc, function (err, response) {
    if (err) { console.log('Error indexing document: ', err); res.send(fileIn+' Error indexing document: '+err); }
      else { console.log('Successfully indexed a document.');
        solrClient.commit(function(err) {
          if(err) { console.log('Error committing change: ' + err); fileIn+ ' Error committing change: '+err}
            else { console.log('Successfully committed changes.'); res.send('Successfully committed changes. '+fileIn);}
        });
      }
  });
}

// the document conversion service does not automatically create a json file which can be used by solr
//
function formatForSolr(_file, _name)
{
  console.log("formatForSolr entered");
  console.log("_file.source_document_id"+JSON.parse(_file).source_document_id)
  var res_json = _file;
  res_json.source_document_id=JSON.parse(_file).source_document_id;
  var answer_units = JSON.parse(res_json).answer_units;
  var _doc = "[";
  for (each in answer_units)
  { (function (_idx, _answer)
    { // the following if statement removes any document section that has a pure number as a title.
      // This removes, for example, the "818" section referenced in the video
      // I will recommend that you remove this if statement and use the web interface, instead, to remove document sections.
      if ((_answer[_idx].content[0].media_type == "text/plain") && (isNaN(_answer[_idx].title.replace(/,/g,""))))
    { var solrDoc =  {"doc" :
      { id: _answer[_idx].id,
        sourceDocId: JSON.parse(_file).source_document_id,
        title: _answer[_idx].title,
        body: _answer[_idx].content[0].text
      }};
      var _comma = ((_idx == 0) ? "" : ", ");
      _doc += _comma+JSON.stringify(solrDoc);
      console.log("id: "+_answer[_idx].id+" _idx: "+_idx+"comma: "+_comma);
    } })(each, answer_units);
  }
  _doc += "]";
  var fm_json = _name.split('.')[0]+"_solr.json";
  var newOutputFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,fm_json);
  fs.writeFileSync(newOutputFile, _doc, function(){console.log("file save completed to: "+newOutputFile);});
  console.log(_doc);
  return(JSON.parse(_doc));
}

// this routine takes the JSON created by the 'convert' routine and builds a single, consolidated file.
// the single, consolidated file is used in the web interface for review and is updated when document sections are deselected.
exports.combine = function(req, res, next)
{
  var docList = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename),env.documentConversion.source_path,"ibv.json")));
  console.log("building combined file");
  var outFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,"docList.json");
  console.log("creating output file: "+outFile);
  fs.writeFileSync(outFile, "[");
  var fileOptions = {flag: 'a'};
  var docIndex = 0;
  for (each in docList.IBV)
  {
    (function(_idx, _array){
      console.log("reading "+_array[_idx].json);
      var inFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,_array[_idx].json)
      console.log("reading from: "+inFile);
      var thisFile = JSON.parse(fs.readFileSync(inFile));
      var docArray = thisFile.answer_units
      for (doc in docArray)
      {
        (function(_docIDX, _docArray)
        {
          console.log(" ----> adding: "+_docArray[_docIDX].id);
          // the following if statement checks for numeric section titles and removes them from the document.
          // I recommend removing this brute-force check and using the web interface instead.
          if (isNaN(_docArray[_docIDX].title.replace(/,/g,"")))
          { // The following lines and if statement check to see if a title has a format similar to "53%", or "60%, 10%"
            // and removes that section from the combined file.
            // I recommend removing this brute force approach and using the web interface instead.
            var pctTitle = _docArray[_docIDX].title;
            var noPctTitle = _docArray[_docIDX].title.replace(/%/g,"");
            if (pctTitle == noPctTitle)
            {
              console.log(" ----> adding: "+_docArray[_docIDX].id);
              var newDoc = {fileName: "", id: "", title: "", body: ""};
              newDoc.fileName = _array[_idx].file;
              newDoc.id = _docArray[_docIDX].id;
              newDoc.title = _docArray[_docIDX].title;
              newDoc.body = _docArray[_docIDX].content[0].text;
              displayObjectValues("newDoc.",newDoc);
              if (docIndex != 0) {fs.writeFileSync(outFile, ",", fileOptions)}
              fs.writeFileSync(outFile, JSON.stringify(newDoc), fileOptions);
            }
            else {console.log(" ----> skipping: "+_docArray[_docIDX].id+"  "+_docArray[_docIDX].title);}
          }
          else {console.log(" ----> skipping: "+_docArray[_docIDX].id+"  "+_docArray[_docIDX].title);}
          docIndex++;
        })(doc, docArray);
      }
    })(each, docList.IBV);
  }
  fs.writeFileSync(outFile, "]", fileOptions);
  console.log("Combine complete")
}

// The getDocList service retrieves the combined document section json file and sends it to the requestor.
// This service is used to set up the 'review document sections' web page.
exports.getDocList=function(req, res, next)
{
  res.send(fs.readFileSync(path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,"docList.json")));
}

// The updateDocList service is used to update the docList.json file
// in the current version of the app, this is called by the web browser from the 'update document sections' web page.
exports.updateDocList=function(req, res, next)
{
  console.log("updateDocList entered");
  fs.writeFileSync(path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,"docList.json"), req.body.newList);
  res.send("update complete");
}

// The saveQuestion service is called from the Training web page
// This service creates a new rankingQuestions.csv file if none exists yet and then adds questions to it as it is repeatedly called.
exports.saveQuestion=function(req, res, next)
{
  var qFile = path.join(path.dirname(require.main.filename),env.documentConversion.json_out_path,"rankingQuestions.csv");
  // each question ranking file MUST be on a separate line. The following 2 lines of code automatically create a new line
  // the if statement is used to ensure that the file does not start with an empty line.
  var newLine = ""
  try {fs.accessSync(qFile, fs.F_OK); newLine= "\n"; } catch (e) { newLine = ""; }
  fs.writeFileSync(qFile, newLine+req.body.question, {flag: 'a'});
  res.send("question saved.");
}

// The search service uses the "retrieve" part of Watson Retrieve and Rank
exports.search=function(req, res, next)
{
  var question = req.body.question;
  var params = {cluster_id: env.retrieveAndRank.cluster_id,
    collection_name: env.retrieveAndRank.collection_name,
    wt: 'json'};
  var solrClient = retrieve_and_rank.createSolrClient(params);
  console.log('Searching for question');
  var query = solrClient.createQuery();
  query.q({ body: question });

solrClient.search(query, function(err, searchResponse)
  {if(err)
    {console.log('Error searching for documents: ' + err);
    res.send(err);
    }
  else { res.send(searchResponse.response); }
  });
}

// the find service calls the "Ranking" part of Watson Retrieve and Rank
exports.find=function(req, res, next)
{
  var question = req.body.question;
  var params = {cluster_id: env.retrieveAndRank.cluster_id,
    collection_name: env.retrieveAndRank.collection_name,
    ranker_id: env.retrieveAndRank.rankerID,
    wt: 'json'};
  var solrClient = retrieve_and_rank.createSolrClient(params);

    var ranker_id = env.retrieveAndRank.rankerID;
    var query     = qs.stringify({q: question, ranker_id: ranker_id, fl: 'id,title,body,fileName'});

    solrClient.get('fcselect', query, function(err, searchResponse)
    {if(err)
        {console.log('Error searching for documents: ' + err);
        res.send(err);
        }
      else { res.send(searchResponse.response); }
      });
}

// this function is included in case you want to do your own debugging and inspection of different javascript objects
function displayObjectValues (_string, _object)
{
  for (prop in _object){
      console.log(_string+prop+": "+(((typeof(_object[prop]) == 'object') || (typeof(_object[prop]) == 'function'))  ? typeof(_object[prop]) : _object[prop]));}
}
