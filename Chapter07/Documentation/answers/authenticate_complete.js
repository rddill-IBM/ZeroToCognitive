var encrypt = require('crypto');
var secret = require('../../env.json').sessionSecret;
// const cipher = encrypt.createCipher('aes192', secret);
// const decipher = encrypt.createDecipher('aes192', secret);

// myUsers is a module which is implemented using couchdb when running locally and cloudant when running in bluemix
// this is where userid information is stored.
var myUsers = require('./cloudant_utils');
// user ids are stored in a database called 'userids'
var u_db = 'userids';
// link to the database and, if needed, create the myUsers table. 
// if this table already exists, then a message will be printed on the server console stating 'database already exists'
myUsers.authenticate(myUsers.create, u_db);

/**
 * authenticate a user based on the information stored in the user id database paired with the provided userid and password 
 * @param {object} req - node js request object
 * req.body has parameters passed in when a post command is used.
 * req.body.uid has the user-provided user id
 * req.body.pw has the encrypted user-provided password
 * @param {object} res - nodejs response object
 * @param {object} next - node js next object - used if this routine does not send a response back to the user
 */
exports.authenticate = function(req, res, next)
{
  // create the ability to decode based on the secret provided in the env.json file 
  var decipher = encrypt.createDecipher('aes192', secret);
  // attempt to retrieve the user id from the user database
  myUsers.get(u_db, req.body.uid, function(error, user)
    { var userProfile = user;
      var getUIDres = JSON.parse(user);
      var authMsg = "";
      // an error may be provided in an error object, or as part of the information passed
      // back in the uid results object. 
      // if either of those indicates an error, then this user does not exist in the database
      if(error || (typeof(getUIDres.error) != 'undefined' ))
      {res.status(401).send("User id "+req.body.uid+" does not exist. Do you want to register?");
      }
      else{
        // decrypt the stored password
        var decrypted = decipher.update(getUIDres.pw, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        // check to see if the stored password matches the inbound password
        if (decrypted == req.body.pw)
        {authMsg = "success";
        // passwords match, update the browser
          res.status(200).send(authMsg);
          var _profile = JSON.parse(userProfile);
          // update this users profile
          _profile.authenticated = true;
          var fullSession = getCookieValue(req.headers.cookie, "connect.sid").split(".");
          // update this users session informaton
          _profile.session = fullSession[0].substring(4);

          // update the database with the latest profile
          myUsers.update(u_db, _profile._id, _profile,
            function(error, user)
            {authMsg = "userProfile for "+_profile._id+" updated to show authenticated. returned body is: "+JSON.stringify(user);});
        }
          else
          {authMsg = "User ID and Password do not match"; res.status(401).send(authMsg);}
      }
    });
}

/**
 * register a user based on the provided userid and password 
 * @param {object} req - node js request object
 * req.body has parameters passed in when a post command is used.
 * req.body.uid has the user-provided user id
 * req.body.pw has the encrypted user-provided password
 * @param {object} res - nodejs response object
 * @param {object} next - node js next object - used if this routine does not send a response back to the user
 */
exports.register = function(req, res, next)
{
  // add uid, pw to cloudant db
  var uid = null; uid = req.body.uid;
  var _pw = null; _pw = req.body.pw;
  var cipher = encrypt.createCipher('aes192', secret);
  encrypt the stored password
  var pw = cipher.update(_pw, 'utf8', 'hex');
  pw += cipher.final('hex');
  // attempt to retrieve this userid from the database. if the get is successful, then the userid already exists and registration will fail
  // because they already exist. If the get fails, the user id does not exist and registration can proceed
  myUsers.get(u_db, uid, function(error, _user)
  {
    var user = null; user = JSON.parse(_user);
    var regMsg = "";
    // check to see if there was an error on the get (there should be)
    // if so, register the userid and password
    if((error) || ((typeof(user.error) != 'undefined') && (user.error != null)))
      {
        // this userid is not in the database, so add it along with the encrypted password. 
        myUsers.insert(u_db, uid, {"_id": uid, "pw": pw, "session": getCookieValue(req.headers.cookie, "connect.sid"), "authenticated": false},
        function(error, body)
          {
            // check to make sure there was no error. If an error occurs, capture it, otherwise capture the success message
            if (typeof(body.error) != 'undefined') {regMsg = body.error;}
            else {regMsg = "Welcome! Registration for UserID: "+uid+" completed successfully. Please log in with your new id.";}
            // send the error/success message back to the browser
           res.send(regMsg);
        });
      }
      // this user already exists in the database and cannot be re-registered. 
    else{ regMsg = "user: "+uid+" already exists in db"; console.log(regMsg); res.send(regMsg);}
  });
}

/**
 * provide a log-out service 
 * @param {object} req - node js request object
 * req.body has parameters passed in when a post command is used.
 * req.body.uid has the user-provided user id
 * @param {object} res - nodejs response object
 * @param {object} next - node js next object - used if this routine does not send a response back to the user
 */
exports.logout = function(req, res, next)
{
  myUsers.get(u_db, req.body.uid, function(error, _user)
  {
    var user = null; user = JSON.parse(_user);
    var regMsg = "";
    if((error) || ((typeof(user.error) != 'undefined') && (user.error != null)))
      {
        // you can't log out if you weren't first logged in. If you're not in the database, you can't be logged in
        var regMsg = "user: "+uid+" is not in db";
        res.send(regMsg);
      } else {
        // log me out
        var _profile = JSON.parse(_user);
        // change my authenticated status to false
        _profile.authenticated = false;
        // void my session
        _profile.session = null;
        // update the database to show that I'm now logged out
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

/**
 * get the value of a specific cookie
 * @param {String} _cookie - cookies are stored as a semicolon delimited list. 
 * @param {String} _name - name of cookie to find
 * @returns {String} - value of found cookie or empty string '' if not found
 */
function getCookieValue(_cookie, _name)
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
  var cookie_array= _cookie.split(";");
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
