// utility functions
var authenticated = false;
var toLoad = "";
var login; var register; var userID = "";
/**
 * return a boolean value (true or false) showing whether the user has been authenticated yet
 * @returns {Boolean} - true if person has been authenticated, false if not
 */
function checkAuthenticated() { return(authenticated);}

/**
 * run the authenticate process if the user is not authenticated. if they are, just log that fact to the browser console log
 */
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

/**
 * enable the login and register buttons to process a click event
 */
function activateLoginButtons()
{
  loginButton = $('#login');
  registerButton = $('#register');
  loginButton.on('click',  function () {login();} );
  registerButton.on('click', function(){ register(); });
}

/**
 * starts the log in process, checks for content in the uid and password fields
 */
function login()
{
  // check to make sure that something was entered into the user id field.
  // if no content, then display a message in the message window
  if ($('#uid').val() == "")
  { $("#login_message").empty();$("#login_message").show();
    $("#login_message").append("<p>Please enter a user id.</p>");
    return;
  }
  // check to make sure that something was entered into the password field.
  // if no content, then display a message in the message window
  if ($('#pw').val() == "")
  { $("#login_message").empty();$("#login_message").show();
    $("#login_message").append("<p>Please enter a password</p>");
    return;
  }
  // we have content in both the user id and password fields
  // we will ignore case on the user id, so start by getting rid of leading and trailing blanks and forcing the id to lower case
  userID = $('#uid').val().trim().toLowerCase();
  // create the options object used with the post command and store the userid and password
  var options = {}; options.uid = userID; options.pw = $('#pw').val();
  // get the url of the server
  var url = "https://"+document.location.host+'/auth/authenticate';
  // request authentication
  $.when($.post(url, options)).then(
    function(res, _type, _jqXHR)
    { 
      // this function is entered upon successful completion of the log in process
      $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res+"</p>");
      authenticated = true;
      initPage();
    },
  function(res, _type, _jqXHR)
    {
      // this function is entered if the log in process failed. 
      authenticated = false;
      $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res.responseText+"</p>");
    });
}

/**
 * register the user because they don't already exist in the userid database
 */
function register()
{
  // get rid of leading and trailing blanks. Change to lower case because we don't care about case 
  // for the user id
  userID = $('#uid').val().trim().toLowerCase();
  // create the post object and store the userid and password
  var options = {}; options.uid = userID; options.pw = $('#pw').val();
  var url = "https://"+document.location.host+'/auth/register';
  // request registratoin
  $.when($.post(url, options)).then(
    function(res, _type, _jqXHR)
    { 
      // this function is called if registration was successful
      $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res+"</p>");
    },
  function(res, _type, _jqXHR)
    {
      // this function is called if registration fails
      $("#login_message").empty();$("#login_message").show();
      $("#login_message").append("<p>"+res.responseText+"</p>");
    });
}

/**
 * log the user out
 */
function logout()
{
  if ((authenticated == false) || (userID == "")){authenticated = false; return;}
  // reset the authentication flag
  authenticated = false;
  // set the post options
  var options = {}; options.uid = userID;
  // blank the current user id variable
  userID = "";
  // log the user out and reset the web app
  $.when($.post("/auth/logout", options)).done(initPage());
}

/**
 * check to see what key was pressed. if the user presses the enter key, respond
 * like they clicked on the login button
 */
function detectKey(event)
{
  var code = (event.keyCode ? event.keyCode : event.which);
  if(code == 13) { login(); }
}
