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

function initiateAlchemy()
{
  var _btn = $("#getNews"); var _co = $("#company");
  $("#days").val(5); $("#count").val(5);
  console.log("initiateAlchemy");
  updatePage('news')
  _btn.on("click",  function() {
    // get selector value
    var _feed = $("#newsfeed");
    var _days = $("#days");
    var _count = $("#count");
    console.log("initiateAlchemy button clicked");
    if (_co.val() == "") {$("#newsfeed").empty(); $("#newsfeed").append("<p>Please enter a company identifier</p>"); return;}
    getAlchemyNews(_feed, _co.val(), _days.val(), _count.val(), displayAlchemyNews);
  });
}

function getAlchemyNews(_target, _key, _days, _count, alchemyDisplay)
{
  // var api_key = "df7cb052c7ddbcc693369fddfa345d9787d83c48";
  // var _url_base = "https://gateway-a.watsonplatform.net/calls/data/GetNews?outputMode=json&start=now-{1}d&end=now&dedup=true&count={2}&&q.enriched.url.enrichedTitle.entities.entity.type=company&q.enriched.url.enrichedTitle.entities.entity.text=O[{0}]&return=enriched.url.url,enriched.url.title,enriched.url.enrichedTitle.relations.relation.subject.entities.entity.disambiguated.website,enriched.url.enrichedTitle.docSentiment.type,enriched.url.author&apikey="+api_key;
  // var keywords = "";
  /*
  for (each in _keywords) {(function(_idx, _terms){keywords+=encodeURIComponent(_terms[_idx])+"^";}(each, _keywords))}
  keywords = keywords.substring(0,keywords.length-1);
  console.log("keyword list: "+keywords);
  console.log("key: "+_key+" count: "+_count+" days: "+_days);
  var _url = _url_base.format(keywords, _days, _count);
  console.log(_url);

  $.when($.get(_url)).done(function(_data) {
    var myData = _data;
    alchemyDisplay(_target, _data.result.docs);
    console.log(_data.result.docs[0].source);
  });
  */
  // "Date" in javascript is measured in milliseconds. To back several days requires multiplying the number
  // of days by the number of milliseconds in a day.
  var _ms=24*60*60*1000;
  var options = {};
  var _start, _end;
  // store the key words
  options.query = _key;
  // save the number of documents to retrieve
  options.count = _count
  // calculate the date span
  _end = new Date();
  options.endDate=_end.toISOString().split('T')[0];
  _start = new Date(_end - _days*_ms);
  // call our nodejs service to process this request
  options.startDate=_start.toISOString().split('T')[0];
  $.when($.post('/discovery/getNews', options)).done(function(_res)
  {
    // use the same display function for the Discovery results as we used for
    // Alchemy results.
    alchemyDisplay(_target, _res.data.results);
  });
  
}

function displayAlchemyNews(_target, _data)
{
  _target.empty();
  console.log("displayAlchemyNews entered with: "+_data);
  if (typeof(_data) == 'undefined') {_target.append("<h3>Sorry, no documents found. Please expand your search terms or timeframe.</h3"); return;}
  for (each in _data)
    { 
      (function(_idx, _array)
    { console.log('_array['+each+'] is: ', _array[each]);
      var _hdr = "news_"+_idx+"_header";
      var _bdy = "news_"+_idx+"_content";
      // the author field is not always present. If it's not present, then display
      // a reasonable message. If it is present, use it.
      var _au = (((_array[_idx].author == null) || (typeof(_array[_idx].author) == 'undefined')) ? 'not listed' : _array[_idx].author );
      var _author = "<tr><td>Written by: </td><td>"+_au+"</td></tr>";
      var _sentiment_icon;
      if (_array[_idx].enriched_text.sentiment.document.label == "positive") {_sentiment_icon = '<td><img src="/icons/positive.png"></td>';}
      if (_array[_idx].enriched_text.sentiment.document.label == "neutral") {_sentiment_icon = '<td><img src="/icons/neutral.png"></td>';}
      if (_array[_idx].enriched_text.sentiment.document.label == "negative") {_sentiment_icon = '<td><img src="/icons/negative.png"></td>';}
      var _link = '<tr><td>Link: </td><td><a href="'+_array[_idx].url+'" target="_blank">'+_array[_idx].url+'</a>"';
      // since we have this information, let's display the article summary text in the accordian window. 
      // we're using a table format for display purposes, so use both columns to display the text
      var _text = '<tr><td colspan="2">'+_array[_idx].text+'</td></tr>';
      var _hdr_html = '<div class="acc_header off" id="'+_hdr+'" target="'+_bdy+'" onClick="accToggle(\'newsfeed\', \'news_'+_idx+'\');"><table><tr>'+_sentiment_icon+"<td>"+_array[_idx].title+'</td></tr></table></div >';
      var _bdy_html = '<div class="acc_body off" id="'+_bdy+'"><table>'+_author+_link+_text+'</table></div>';
      _target.append(_hdr_html+_bdy_html);
    })(each, _data);
    }
}
