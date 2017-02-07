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
var events = require('events');
var session = require('express-session');
var mySession = require('./restapi/features/cloudant_utils');
mySession.authenticate(mySession.create, 'session', 'clear');
exports.SessionObject = {
 s_db : 'session',
 sessionData : null,
 all: function all(cbfn)
 {
   console.log("all");
   mySession.listAllDocuments(this.s_db, function(_error, _sessions){if (typeof(cbfn) == 'function') {cbfn(_error, _sessions);}});
 },
 destroy: function destroy(sid, cbfn)
 {
   console.log("destroy");
   mySession.delete(this.s_db, sid, function(_error){if (typeof(cbfn) == 'function') {cbfn(error);}});
 },
 clear : function clear (cbfn)
 {
   console.log("clear");
   mySession.listAllDocuments(this.s_db, function(_error, _sessions)
     {for(each in _sessions){(function(_cur){mySession.delete(this.s_db, _cur.id, _cur.rev, function(_res){});})(_sessions[each])} if (typeof(cbfn) == 'function') {cbfn(true);}});
 },
length :  function length(cbfn)
 {
   console.log("length");
   mySession.listAllDocuments(this.s_db, function(_error, _doc){if (typeof(cbfn) == 'function') {cbfn(error, _doc.totalRows);}})
 },
get : function get(sid, cbfn)
 {
   console.log("get request sid = "+sid);
   mySession.get(this.s_db, sid, function(_error, _session){
     console.log("sessionManager.js get  ");
     var retSession = {};
     if (_error == "ENOENT") {if (typeof(cbfn) == 'function') {cbfn(null, null);}}
     if (typeof(_session) == "string")
     { console.log("_session == error"); }
     else {console.log("_session != error"); for (prop in _session) {
       if ((prop != "key") && (prop != "doc") && (prop != "_id") && (prop != "_rev") ) {retSession[prop]=_session[prop];}}}
     if (typeof(cbfn) == 'function') {cbfn(_error, retSession);}
   });
 },
set : function set(sid, session, cbfn)
 {
   console.log("set with sid = "+sid);
   var _cloudant_session = { "_id": sid};
   var tempSession;
   if (session == null) {tempSession = this.session(null, null)} else {tempSession = session;}
   for (prop in tempSession) { _cloudant_session[prop]=tempSession[prop];}
   mySession.insert(this.s_db, sid, _cloudant_session, function(error, doc){if (typeof(cbfn) == 'function') {cbfn(error);}});
 },
save : function save(sid, session, cbfn)
 {
   options = { "_id": this.id, "cookie": this.cookie};
  this.set(this.id, options, function (error, doc){
  console.log("save completed: "+error);
  if (typeof(sid) == 'function') {sid(error); }
  if (typeof(cbfn) == 'function') {cbfn(error);}
});
 },
touch : function touch(sid, session, cbfn)
 {
   console.log("touch sid: "+sid+" session: "+session);
   if (typeof(sid) == 'undefined') {
     if (typeof(cbfn) == 'undefined') { return({})} else {cbfn(null)}}
   // This recommended method is used to "touch" a given session
   // given a session ID (sid) and session (session) object.
   // The callback should be called as callback(error) once the session has been touched.
   // This is primarily used when the store will automatically delete idle sessions
   // and this method is used to signal to the store the given session is active,
   // potentially resetting the idle timer.
   mySession.get(this.s_db, sid, function(_error, _session){
     if (_session == '{"error":"not_found","reason":"missing"}') {return(_error, null)}
     if (typeof(cbfn) == 'function') {cbfn(_error);}});
     // will need to add code once understand contents of session object.
 },
on : function on (_value, error)
 {
   console.log("function on() emitter entered, value: "+_value+" error: "+error);
   var eventEmitter = new events.EventEmitter();
   switch(_value)
   {
     case 'connect':
     eventEmitter.emit('connect');
     break;
     case 'error':
     eventEmitter.emit('disconnect', error);
     break;
     default:
     eventEmitter.emit(_value);
   }
 },
createSession : function createSession(req, session)
 {
   console.log("createSession "+session);
   var sess = session;
   if((sess = '{"error":"not_found","reason":"missing"}') || (JSON.stringify(session) == '{}'))
     {console.log( " no valid session provided, creating new one."); sess = this.session(req, null);}
     this.id = sess.id;
     console.log("createSession session id is: "+sess.id)
   if(typeof(sess.cookie) == "undefined")
     { console.log("sess.cookie is undefined");
      sess.cookie = this.Cookie();
       sess.cookie.expires = new Date(Date.now()+(60*60*1000));
       sess.cookie.orignalMaxAge = new Date(Date.now()+(60*60*1000));
       console.log("sess.cookie has been created");
     }
     else
     { console.log("sess.cookie already exists");
     var expires = sess.cookie.expires, orig = sess.cookie.originalMaxAge;
       sess.cookie = this.Cookie(sess.cookie);
       sess.cookie.expires = new Date(expires);
       sess.cookie.originalMaxAge = orig;
     }
   req.session = sess.req.session;
   req.session.cookie = sess.cookie;
   console.log("createSession complete")
   return req.session;
 },
Cookie :  function Cookie (options) {
   console.log("Cookie");
   var _cookie = {};
   _cookie.path = '/';
   _cookie.maxAge = null;
   _cookie.httpOnly = true;
   if (options) { for(var propt in options){ _cookie.propt = options.propt; } }
   _cookie.originalMaxAge == undefined == _cookie.originalMaxAge
     ? _cookie.maxAge
     : _cookie.originalMaxAge;
     return(_cookie);
 },
session : function session(req, data) {
   console.log("session");
 var _session = {"req": null, "id": null};
   _session.req = {};
   _session.req["session"] = req.sessionStore;
   for(prop in req.sessionStore) {_session[prop] = req.sessionStore[prop]; }
   _session.id = req.sessionID;
   if ((typeof(data) != 'undefined') && ('object' == typeof data)) { for(var propt in data){ _session[propt] = data[propt]; } }
   return(_session);
 }

};
