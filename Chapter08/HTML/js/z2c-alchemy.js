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
  _btn.on("click",  function() {
    // get selector value
    var _feed = $("#newsfeed");
    var _days = $("#days");
    var _count = $("#count");
    console.log("initiateAlchemy button clicked");
  });
}

function getAlchemyNews(_target, _key, _days, _count, alchemyDisplay)
{

}

function displayAlchemyNews(_target, _data)
{
  _target.empty();

}
