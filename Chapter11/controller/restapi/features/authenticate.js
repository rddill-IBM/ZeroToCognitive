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
var encrypt = require('crypto');
var secret = require('../../env.json').sessionSecret;
// const cipher = encrypt.createCipher('aes192', secret);
// const decipher = encrypt.createDecipher('aes192', secret);

var myUsers = require('./cloudant_utils');
var u_db = 'userids';
myUsers.authenticate(myUsers.create, u_db);
exports.authenticate = function(req, res, next)
{
  var decipher = encrypt.createDecipher('aes192', secret);
  myUsers.get(u_db, req.body.uid, function(error, user)
    { var userProfile = user;
      var getUIDres = JSON.parse(user);
      var authMsg = "";
      if(error || (typeof(getUIDres.error) != 'undefined' ))
      {res.status(401).send("User id "+req.body.uid+" does not exist. Do you want to register?");
      }
      else{
        var decrypted = decipher.update(getUIDres.pw, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        if (decrypted == req.body.pw)
        {authMsg = "success";
          res.status(200).send(authMsg);
          var _profile = JSON.parse(userProfile);
          _profile.authenticated = true;
          var fullSession = getCookieValue(req.headers.cookie, "connect.sid").split(".");
          _profile.session = fullSession[0].substring(4);

          myUsers.update(u_db, _profile._id, _profile,
            function(error, user)
            {authMsg = "userProfile for "+_profile._id+" updated to show authenticated. returned body is: "+JSON.stringify(user);});
        }
          else
          {authMsg = "User ID and Password do not match"; res.status(401).send(authMsg);}
      }
    });
}
exports.register = function(req, res, next)
{
  // add uid, pw to cloudant db
  var uid = null; uid = req.body.uid;
  var _pw = null; _pw = req.body.pw;
  var cipher = encrypt.createCipher('aes192', secret);
  var pw = cipher.update(_pw, 'utf8', 'hex');
  pw += cipher.final('hex');
  myUsers.get(u_db, uid, function(error, _user)
  {
    var user = null; user = JSON.parse(_user);
    var regMsg = "";
    if((error) || ((typeof(user.error) != 'undefined') && (user.error != null)))
      {myUsers.insert(u_db, uid, {"_id": uid, "pw": pw, "session": getCookieValue(req.headers.cookie, "connect.sid"), "authenticated": false},
        function(error, body)
          {
            if (typeof(body.error) != 'undefined') {regMsg = body.error;}
            else {regMsg = "Welcome! Registration for UserID: "+uid+" completed successfully. Please log in with your new id.";}
           res.send(regMsg);
        });
      }
    else{ regMsg = "user: "+uid+" already exists in db"; console.log(regMsg); res.send(regMsg);}
  });
}
exports.logout = function(req, res, next)
{
  myUsers.get(u_db, req.body.uid, function(error, _user)
  {
    var user = null; user = JSON.parse(_user);
    var regMsg = "";
    if((error) || ((typeof(user.error) != 'undefined') && (user.error != null)))
      {
        var regMsg = "user: "+uid+" is not in db";
        res.send(regMsg);
      } else {
        var _profile = JSON.parse(_user);
        _profile.authenticated = false;
        _profile.session = null;
      myUsers.update(u_db, req.body.uid, _profile,
        function(error, body)
          {
            if (typeof(body.error) != 'undefined') {regMsg = body.error;}
            else {regMsg = "Logout successful";}
           res.send(regMsg);
         });
      }
  });
}
function getCookieValue(_cookie, _name)
{
  var name = _name+"=";
  var cookie_array= _cookie.split(";");
  for (each in cookie_array)
    { var c = cookie_array[each].trim();
      if(c.indexOf(name) == 0) return(c.substring(name.length, c.length));
    }
    return("");
}
