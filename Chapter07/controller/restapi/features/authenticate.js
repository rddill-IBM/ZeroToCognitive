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


}
exports.register = function(req, res, next)
{


}
exports.logout = function(req, res, next)
{

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
