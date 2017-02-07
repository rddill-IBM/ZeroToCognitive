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
// cloudant support
var cloudantAuth;
var cloudant_credentials;
var request = require('request');
function displayObjectProperties(_obj)
{
  for(var property in _obj){ console.log("object property: "+property ); }
}
function displayObjectPropertyValues(_obj)
{
  for(var property in _obj){ console.log("object property: "+property+" with value: "+_obj[property] ); }
}
exports.authenticate=authenticate;
exports.logout=logout;
exports.create=create;
exports.drop=drop;
exports.insert=insert;
exports.get=get;
exports.update=update;
exports.listAllDatabases=listAllDatabases;
exports.listAllDocuments=listAllDocuments;
exports.checkAccess=checkAccess;
exports.capabilities=capabilities;
exports.delete=deleteItem;

function authenticate(cbfn, _name, _clear)
{
  cloudant_credentials = require('../../env.json').cloudant;
  var params = "name="+cloudant_credentials.username+"&password="+cloudant_credentials.password
  request({
        url: cloudant_credentials.url+"/_session",
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        form: params
    }, function(error, response, body) {
        if (error) { console.log("authenticate error: "+error)}
        else { cloudantAuth=response["headers"]["set-cookie"];
        if(_name!=""){if (typeof(cbfn) == 'function') {cbfn(_name, _clear);}}}
    });
}
function logout(_user)
{
  // log this user out of the database. disables the current authentication cookie.
}
function create(_name, _clear)
{
  // create a new database
  var _url = cloudant_credentials.url+"/"+_name;
  request({
        url: _url,
        headers: {"set-cookie": cloudantAuth, 'Accept': '/'},
        method: "PUT",
    }, function(error, response, body) {
      var _body = JSON.parse(body);
        if ((error) || ((typeof(_body.error) != 'undefined') && (_body.error != null)))
          { if ((typeof(_body.error) != 'undefined') && (_body.error != null))
            { }
            else { }
          }
        else { }
        if((typeof(_clear) != 'undefined') && (_clear == 'clear'))
          {drop(_name, create)}
    });
}
function drop(_name, cbfn)
{
  // drop a database
  request({
        url: cloudant_credentials.url+"/"+_name,
        method: "DELETE"
    }, function(error, response, body)
    { if (typeof(cbfn) == 'function') {cbfn(_name);}});
}
function insert(_name, oid, _object, cbfn)
{
  // insert JSON _object into database _name
  request({
        url: cloudant_credentials.url+"/"+_name,
        json: _object,
        method: "POST"
    }, function(error, response, body) {
        if (error)
          {  if (typeof(cbfn) == 'function') {cbfn(error, body);}}
        else
          { if (typeof(cbfn) == 'function') {cbfn(error, body);}}
    });
}

function get(_name, _oid, cbfn)
{
  // select objects from database _name specified by selection criteria _selector
  request({
        url: cloudant_credentials.url+"/"+_name+"/"+_oid,
        method: "GET"
    }, function(error, response, body) {
        if (error) {  if (typeof(cbfn) == 'function') {cbfn(error, null);}}
        else { var dbArray = body;
        if (typeof(cbfn) == 'function') {if (typeof(cbfn) == 'function') {cbfn(error, dbArray);}}
      }
    });
}
function update(_name, _id, _object, cbfn)
{
  // update JSON object specified by object _oid in database _name with new object _object
  request({
        url: cloudant_credentials.url+"/"+_name+"/"+_id,
        json: _object,
        method: "PUT"
    }, function(error, response, body) {
        if (error) { if (typeof(cbfn) == 'function') {cbfn(error, JSON.parse(body));} }
        else { var dbArray = body;
        if (typeof(cbfn) == 'function') {cbfn(error, dbArray);}
      }
    });
}
function deleteItem(_name, _oid, _rev, cbfn)
{
  // delete object specified by _oid in database _name /$DATABASE/$DOCUMENT_ID?rev=$REV
  request({
        url: cloudant_credentials.url+"/"+_name+"/"+_oid+"?rev="+_rev,
        method: "DELETE"
    }, function(error, response, body) {
        if (error) { if (typeof(cbfn) == 'function') {cbfn(error);}}
        else {if (typeof(cbfn) == 'function') {cbfn(error);}
      }
    });
  }
function listAllDatabases(cbfn)
{
  // list all databases I can access
  request({
        url: cloudant_credentials.url+"/_all_dbs",
        method: "GET"
    }, function(error, response, body) {
        if (error) { }
        else { var dbArray = body;
        if (typeof(cbfn) == 'function') {cbfn(dbArray);}
      }
    });
}
function listAllDocuments(_name, cbfn)
{
  // list all documents in database _name
  request({
        url: cloudant_credentials.url+"/_all_docs",
        method: "GET"
    }, function(error, response, body) {
        if (error) {  if (typeof(cbfn) == 'function') {cbfn(error, JSON.parse(body))}}
        else { var docObj = JSON.parse(body);
        if (typeof(cbfn) == 'function') {cbfn(error, docObj);}
      }
    });
}

function checkAccess(cbfn)
{
  request({
        url: cloudant_credentials.url+"/",
        method: "GET" },
        function(error, response, body) {
        if (error) { ;}
        else { if (typeof(cbfn) == 'function') {cbfn(body);}}
    });
}

function capabilities()
{
  var _c = {};
  _c.authenticate = "function (): uses credentials in env.json file to authenticate to cloudant server";
  _c.create = "function (_name): create a new database";
  _c.drop = "function (_name): drop a database";
  _c.insert = "function (_name, _object): insert JSON _object into database _name";
  _c.update = "function (_name, _oid, _object): update JSON object specified by object _oid in database _name with new object _object";
  _c.select = "function (_name, _selector): select objects from database _name specified by selection criteria _selector";
  _c.delete = "function (_name, _oid): delete object specified by _oid in database _name";
  _c.listAllDatabases = "function (): list all databases I can access";
  _c.listAllDocuments = "function (_name): list all documents in database _name";
  _c.capabilities = "return this object with descriptors."
  return (_c);
}
