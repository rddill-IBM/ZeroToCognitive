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
/*
 * Zero to Cognitive Chapter 7
 */
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var cloudant = require('cloudant');
var myDB = require('./controller/restapi/features/cloudant_utils');
myDB.authenticate(myDB.create, '');
var sessionBase  = require('./controller/sessionManagement');
var sessionStore = Object.create(sessionBase.SessionObject);

var vcapServices = require('vcap_services');
var uuid = require('uuid');
var env = require('./controller/env.json');

var sessionSecret = env.sessionSecret;
var gmailCredentials = env.gmail;

var appEnv = cfenv.getAppEnv();
var app = express();
// the session secret is a text string of arbitrary length which is
//  used to encode and decode cookies sent between the browser and the server
/**
for information on how to enable https support in osx, go here:
  https://gist.github.com/nrollr/4daba07c67adcb30693e
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
**/
if (cfenv.getAppEnv().isLocal == true)
{
  var pkey = fs.readFileSync('key.pem');
  var pcert = fs.readFileSync('cert.pem')

  var httpsOptions = { key: pkey, cert: pcert };
} else {
  app.enable('trust proxy');
  app.use (function (req, res, next) {
          if (req.secure) {next();}
          else {res.redirect('https://' + req.headers.host + req.url);}
  });
}

app.use(cookieParser(sessionSecret));
app.use( session( {
    store: sessionStore,
    secret: sessionSecret, resave: false, saveUninitialized: true,
    cookie: {secure: true, maxAge:24*60*60*1000},
    genid: function (req) {return uuid.v4()}
  }));
app.get('/login*', function (req, res) {console.log("login session is: "+req.session); loadSelectedFile(req, res);});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('appName', 'z2c-chapter07');
app.set('port', appEnv.port);

app.set('views', path.join(__dirname + '/HTML'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/HTML'));
app.use(bodyParser.json());

// Define your own router file in controller folder, export the router, add it into the index.js.
// app.use('/', require("./controller/yourOwnRouter"));

app.use('/', require("./controller/restapi/router"));

if (cfenv.getAppEnv().isLocal == true)
  {
    https.createServer(httpsOptions, app).listen(app.get('port'),
        function(req, res) {console.log(app.get('appName')+' is listening on port: ' + app.get('port'));});
  }
  else
  {
    var server = app.listen(app.get('port'), function() {console.log('Listening on port %d', server.address().port);});
  }
app.all( function(req, res, next) {
  if (checkSession) {next();}
  else{res.send(400,"session expired");}
})


function loadSelectedFile(req, res) {
    var uri = req.originalUrl;
    var filename = __dirname + "/HTML" + uri;
    fs.readFile(filename,
        function(err, data) {
            if (err) {
                console.log('Error loading ' + filename + ' error: ' + err);
                return res.status(500).send('Error loading ' + filename);
            }
            var type = mime.lookup(filename);
            console.log("loading "+uri+" with mime: "+ type);
           res.setHeader('content-type', type);
            res.writeHead(200);
            res.end(data);
        });
}
function displayObjectValues (_string, _object)
{
  for (prop in _object){
//    if (typeof(_object[prop]) != 'function')
//    {
      console.log(_string+prop+": "+(((typeof(_object[prop]) == 'object') || (typeof(_object[prop]) == 'function'))  ? typeof(_object[prop]) : _object[prop]));}
//  }
}
