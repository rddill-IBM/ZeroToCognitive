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
/**
 * iterate through the document cookies and look for one with the provided name. 
 * if the cookie is found, send back whatever value is associated with it. 
 * otherwise, send back an empty string. 
 * @param {String} _name - the name of the cookie to find
 * @returns {String} the value of the found cookie, or an empty string: ""
 */
function getCookieValue(_name)
{
  // cookies are stored with the following structure:  <name>=<value>;
  // Since what we're going to want is the part after the equal sign and we want to avoid a 
  // situation where the name of one cookie is the beginning of the name of another cookie, e.g.
  // cookie #1 has a value of colorb=blue and cookie #2 has a value of colorblack=black
  // we're going to search on the value of cookie name + "=" sign; that is, in the previous example
  // we will search on "colorb=" rather than just "colorb"
  var name = _name+"=";
  // cookies are stored in a single long string in the html document and each cookie is separated by a semi-colon
  // that means that we can use the presence of a semicolon to separate all the cookies into individual array elements
  var cookie_array= document.cookie.split(";");
  // iterate through the array to find the cookie we want.
  for (each in cookie_array)
    {
      //remove extra white space
       var c = cookie_array[each].trim();
       // search to see if we have the cookie we want. If we do, then the result of indexOf will be zero (0).
       // if we found our cookie, then return a string that's whatever is left in 'c' after the equal (=) sign.
      if(c.indexOf(name) == 0) return(c.substring(name.length, c.length));
    }
    return("");
}

// Inspired by http://bit.ly/juSAWl
// Augment String.prototype to allow for easier formatting.  This implementation
// doesn't completely destroy any existing String.prototype.format functions,
// and will stringify objects/arrays.
String.prototype.format = function(i, safe, arg) {

  function format() {
    var str = this, len = arguments.length+1;

    // For each {0} {1} {n...} replace with the argument in that position.  If
    // the argument is an object or an array it will be stringified to JSON.
    for (i=0; i < len; arg = arguments[i++]) {
      safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
      str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
    }
    return str;
  }

  // Save a reference of what may already exist under the property native.
  // Allows for doing something like: if("".format.native) { /* use native */ }
  format.native = String.prototype.format;

  // Replace the prototype property
  return format;

}();

// 
/**
 * strip leading and trailing blanks and a final period if exists 
 * Watson speech to text may add leading or trailing blanks to text and, if a pause is long enough, will add a period as well.
 * if we're performing a text comparison, we need to remove the leading and trailing blanks and period
 * @param {String} _str - the string to trim
 * @returns {String} the trimmed string
 */
function trimStrip(_string)
{
  // remove leading and trailing blanks
  var str = _string.trim();
  var len = str.length;
  // check to see if the string has a period on the end. If it does, remove it
  if(str.endsWith(".")) {str=str.substring(0,len-1);}
  // return the trimmed string
  return(str);
}
