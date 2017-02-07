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
// utility functions
var authenticated = false;
var toLoad = "";
var login; var register; var userID = "";
function checkAuthenticated() { return(authenticated);}

function authenticate()
{
    console.log("authenticate entered");
  if (!authenticated)
  {
    // activate log in and register buttons
    console.log("not yet authenticated")
    activateLoginButtons();
  }
  else
  {
    console.log("authenticated")
  }
}

function activateLoginButtons()
{
  loginButton = $('#login');
  registerButton = $('#register');
  loginButton.on('click',  function () {login();} );
  registerButton.on('click', function(){ register(); });
}
function login()
{
  if ($('#uid').val() == "")
  { $("#login_message").empty();$("#login_message").show();
    $("#login_message").append("<p>Please enter a user id.</p>");
    return;
  }
  if ($('#pw').val() == "")
  { $("#login_message").empty();$("#login_message").show();
    $("#login_message").append("<p>Please enter a password</p>");
    return;
  }
  userID = $('#uid').val().trim().toLowerCase();
  var options = {}; options.uid = userID; options.pw = $('#pw').val();
  var url = "https://"+document.location.host+'/auth/authenticate';
  $.when($.post(url, options)).then(
    function(res, _type, _jqXHR)
    { $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res+"</p>");
      authenticated = true;
      initPage();
    },
  function(res, _type, _jqXHR)
    { authenticated = false;
      $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res.responseText+"</p>");
    });
}

function register()
{
  userID = $('#uid').val().trim().toLowerCase();
  var options = {}; options.uid = userID; options.pw = $('#pw').val();
  var url = "https://"+document.location.host+'/auth/register';
  $.when($.post(url, options)).then(
    function(res, _type, _jqXHR)
    { $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res+"</p>");
    },
  function(res, _type, _jqXHR)
    { $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res.responseText+"</p>");
    });
}
function logout()
{
  if ((authenticated == false) || (userID == "")){authenticated = false; return;}
  authenticated = false;
  var options = {}; options.uid = userID;
  userID = "";
  $.when($.post("/auth/logout", options)).done(initPage());
}
function detectKey(event)
{
  var code = (event.keyCode ? event.keyCode : event.which);
  if(code == 13) { login(); }
}
