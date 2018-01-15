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
 * getEnvironments retrieves a JSON object with the environments currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.getEnvironments = function(req, res, next)
{
  discovery.getEnvironments({}, 
    function (err, response) {
      if (err)
        {console.log('error:', err);
        res.send({'result': 'error', 'message': err.message});}
      else
        {console.log(JSON.stringify(response, null, 2));
        res.send({'result': 'success', 'data': response});}
  });
}

/**
 * createEnvironment creates a new environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.name has the post information for the environment name
 * req.body.description has the post information for the environment description
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.createEnvironment = function(req, res, next)
{
  discovery.createEnvironment({
    name: req.body.name,
    description: req.body.description,
    size: 1
  },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * listEnvironmentDetails gets detailed information for a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.listEnvironmentDetails = function(req, res, next)
{
  discovery.getEnvironment({ environment_id: req.body.environmentID },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * listConfigurations lists all configurations for the specified environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.listConfigurations = function(req, res, next)
{
  discovery.getConfigurations({ environment_id: req.body.environmentID },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * getConfiguration retrieves configuration details for a single configuration for the specified environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.configurationID has the post information for the configuration id
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.getConfigurationDetails = function(req, res, next)
{
  discovery.getConfiguration({ environment_id: req.body.environmentID, configuration_id: req.body.configurationID },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * getCollections retrieves a JSON object with the collections currently identifed for the specified environment for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.listCollections = function(req, res, next)
{
  discovery.getCollections({ environment_id: req.body.environmentID }, 
    function (err, response) {
      if (err)
        {console.log('error:', err);
        res.send({'result': 'error', 'message': err.message});}
      else
        {console.log(JSON.stringify(response, null, 2));
        res.send({'result': 'success', 'data': response});}
  });
}

/**
 * createCollection creates a new collection in the specified environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.name has the post information for the collection name
 * req.body.description has the post information for the collection description
 * req.body.configurationID has the post information for the configuration id to use with this collection
 * req.body.language has the post information for the language to use
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.createCollection = function(req, res, next)
{
  discovery.createCollection({ environment_id: req.body.environmentID, name: req.body.name, description: req.body.description, configuration_id: req.body.configurationID, language: req.body.language },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * listCollectionDetails gets detailed information for a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.configurationID has the post information for the configuration id to use with this collection
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.getCollectionDetails = function(req, res, next)
{
  discovery.getCollection({ environment_id: req.body.environmentID, collection_id: req.body.collectionID },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * deleteCollection deletes a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.collectionID has the post information for the configuration id to use with this collection
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.deleteCollection = function(req, res, next)
{
  discovery.deleteCollection({ environment_id: req.body.environmentID, collection_id: req.body.collectionID },
  function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {console.log(JSON.stringify(response, null, 2));
      res.send({'result': 'success', 'data': response});}
  });
}

/**
 * getDocumentList returns a list of documents and their status specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 *  --> consider drag and drop support? pull that over from C08?
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.getDocumentList = function(req, res, next)
{
  var newInputFile = path.join(path.dirname(require.main.filename), config.discovery.source_path, config.discovery.documentList);
  var docList = JSON.parse(fs.readFileSync (newInputFile, 'utf8'));
  console.log(JSON.stringify(docList, null, 2));
  res.send({'result': 'success', 'data': docList});
}

/**
 * addDocument adds a single document into a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.configurationID has the post information for the configuration id to use with this collection
 * req.body.fileName is the name of the file to add
 *  --> consider drag and drop support? pull that over from C08?
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.addDocument = function(req, res, next)
{
  console.log('req.body.environmentID: '+req.body.environmentID);
  console.log('req.body.collectionID: '+req.body.collectionID);
  console.log('req.body.fileName: '+req.body.fileName);
  console.log('req.body.collectionName: '+req.body.collectionName);
  let newInputFile = path.join(path.dirname(require.main.filename),config.discovery.source_path, req.body.fileName);
  discovery.addDocument({ environment_id: req.body.environmentID, collection_id: req.body.collectionID, file: fs.createReadStream(newInputFile) },
    function (err, response) {
      if (err)
        {console.log('error:', err);
        res.send({'result': 'error', 'message': err.message});}
      else
        { docListUpdate(req.body.fileName, req.body.collectionName, response.document_id);
          res.send({'result': 'success', 'data': {"add": response, "collection": req.body.collectionName, "fileName": req.body.fileName}});
        }
    });
}

/**
 * getDocumentDetails retrieves the details for a single document into a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.configurationID has the post information for the configuration id to use with this collection
 * req.body.fileName is the name of the file to add
 *  --> consider drag and drop support? pull that over from C08?
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.getDocumentDetails = function(req, res, next)
{
  // curl -u "{username}":"{password}" "https://gateway.watsonplatform.net/discovery/api/v1/environments/{environment_id}/collections/{collection_id}/documents/{document_id}?version=2017-11-07"
  var username = config.discovery.username,
  password = config.discovery.password,
  url = 'https://' + username + ':' + password + '@gateway.watsonplatform.net/discovery/api/v1/environments/'+req.body.environmentID+'/collections/'+req.body.collectionID+'/documents/'+req.body.documentID+'?version=2017-11-07';
  console.log('url: '+url);
  request({url: url}, function (err, response, body) 
  {
    console.log('err: ', err);
      if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      { console.log('body: ',body);
        res.send({'result': 'success', 'data': JSON.parse(body)});
      }
  });    
}

/**
 * queryCollection queries a specific collection in a specific environment for the currently identifed for the userid and password stored in the env.json file
 * 
 * @param {object} req - nodejs object with the request information 
 * req.body.environmentID has the post information for the environment id
 * req.body.configurationID has the post information for the configuration id to use with this collection
 * req.body.queryString has the query details
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
*/
exports.queryCollection = function(req, res, next)
{
  //discovery.query({ environment_id: req.body.environmentID, collection_id: req.body.collectionID, natural_language_query: req.body.queryString, passages: true, passages_count: 10, highlight: true },
  let _method = 'queryCollection';
  console.log(_method+ ' EnvironmentID: '+ req.body.environmentID);
  console.log(_method+ ' collectionID: '+ req.body.collectionID);
  console.log(_method+ ' query: '+ req.body.queryString);
  discovery.query({ environment_id: req.body.environmentID, collection_id: req.body.collectionID, natural_language_query: encodeURIComponent(req.body.queryString), passages: true },
      function (err, response) {
    if (err)
      {console.log('error:', err);
      res.send({'result': 'error', 'message': err.message});}
    else
      {res.send({'result': 'success', 'data': response});}
  });
}


/**
 * getID returns a json object with all environments, configurations and collections
 * in the Discovery News version, since we are not creating any of the above, there
 * will be one environment, one configuration and one collection returned.
 * @param {object} req - nodejs object with the request information 
 * req.body holds post parameters
 * @param {object} res - nodejs response object
 * @param {object} next - nodejs next object - used if this routine does not provide a response
 */
exports.getID = function(req, res, next)
{
    var method = "getID";
    discovery.getEnvironments({}, function(error, data) {
        if (error)
        {
            console.log(method+" failed: "+error);
            res.send({"results": "failed", "data": error});
        }
        else
        {
            console.log(method+" success! "+JSON.stringify(data, null, 2));
            res.send({"results": "success", "data": JSON.stringify(data, null, 2)});
        }
      });
}

/**
 * docListUpdate
 */
function docListUpdate(_fileName, _collection, _document_id)
{
  // read in file, parse
  var newInputFile = path.join(path.dirname(require.main.filename), config.discovery.source_path, config.discovery.documentList);
  var docList = JSON.parse(fs.readFileSync (newInputFile, 'utf8'));
  // find this file
  let newDocList = {};
  newDocList.documents = [];
  for (each in docList.documents)
  {
    (function(_idx, _arr){
      newDocList.documents[_idx] = _arr[_idx];
      // update collection status
      if (_arr[_idx].file === _fileName) 
      {
        newDocList.documents[_idx].uploaded = _collection;
        newDocList.documents[_idx].document_id = _document_id;
      }
    })(each, docList.documents)
  }
  // write stringified back
  fs.writeFileSync(newInputFile, JSON.stringify(newDocList));
}