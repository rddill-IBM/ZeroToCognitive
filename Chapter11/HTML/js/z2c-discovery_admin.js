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
// z2c-discovery.js
// browser support for discovery

let d_target, env1, env2, env3, env4, env5;

// initialize the page
function initiateDiscovery_admin()
{   d_target = $('#discovery_res');
    env1 = $('#env_id');
    env2 = $('#env_id2');
    env3 = $('#env_id3');
    env4 = $('#env_id4');
    env5 = $('#env_id5');
    env6 = $('#env_id6');
    env7 = $('#env_id7');
    env8 = $('#env_id8');
    env9 = $('#env_id9');
    env10 = $('#env_id10');
    conf_id = $('#conf_id');
    conf_id2 = $('#conf_id2');
    col_id = $('#col_id');
    col_id2 = $('#col_id2');
    col_id3 = $('#col_id3');
    col_id4 = $('#col_id4');
    col_id5 = $('#col_id5');
    lang_id = $('#lang_id');
    doc_name = $('#doc_name');
    doc_name2 = $('#doc_name2');
    listEnvironments();
}
function listEnvironments()
{
  let _method = 'listEnvironments';
  getIt('/discovery/getEnvironments', _method, display_listEnvironments, d_target);
}

function getEnvironmentDetails()
{
  let _method = 'getEnvironmentDetails';
  let _options = {};
  _options.environmentID = env1.find(':selected').val();
  postIt('/discovery/listEnvironmentDetails', _method, display_getEnvironmentDetails, d_target, _options);
}

function createEnvironment()
{
  let _method = 'createEnvironment';
  let _options = {};
  _options.name = $('#env_name').val();
  _options.description = $('#env_desc').val();
  postIt('/discovery/createEnvironment', _method, display_createEnvironment, d_target, _options);

}

function listConfigurations()
{
  let _method = 'listConfigurations';
  let _options = {};
  _options.environmentID = env2.find(':selected').val();
  env3.val(_options.environmentID);
  postIt('/discovery/listConfigurations', _method, display_listConfigurations, d_target, _options);

}
function getConfigurationDetails()
{
  let _method = 'getConfigurationDetails';
  let _options = {};
  _options.environmentID = env3.find(':selected').val();
  _options.configurationID = conf_id.find(':selected').val();
  postIt('/discovery/getConfigurationDetails', _method, display_getConfigurationDetails, d_target, _options);

}
function listCollections()
{
  let _method = 'listCollections';
  let _options = {};
  _options.environmentID = env4.find(':selected').val();
  env5.val(_options.environmentID);
  postIt('/discovery/listCollections', _method, display_listCollections, d_target, _options);
}
function getCollectionDetails()
{
  let _method = 'getCollectionDetails';
  let _options = {};
  _options.environmentID = env5.find(':selected').val();
  _options.collectionID = col_id.find(':selected').val();
  postIt('/discovery/getCollectionDetails', _method, display_getCollectionDetails, d_target, _options);
}
function createCollection()
{
  let _method = 'createCollection';
  let _options = {};
  _options.environmentID = env6.find(':selected').val();
  _options.configurationID = conf_id2.find(':selected').val();
  _options.name = $('#col_name').val();
  _options.description = $('#col_desc').val();
  _options.language = lang_id.find(':selected').val();
  console.log(_options);
  postIt('/discovery/createCollection', _method, display_createCollection, d_target, _options);
}

function deleteCollection()
{
  let _method = 'deleteCollection';
  let _options = {};
  _options.environmentID = env7.find(':selected').val();
  _options.collectionID = col_id2.find(':selected').val();
  console.log(_options);
  postIt('/discovery/deleteCollection', _method, display_deleteCollection, d_target, _options);
}

function display_getEnvironmentDetails(_res)
{
    d_target.empty(); let _str = ''; 
    _str = '<h3> List Environments results for: '+_res.data.name+'</h3>';
    _str += '<table width="100%"><tr><th>Object</th><th>Value</th></tr>';
    for (let keys in _res.data)
    {(function(_key, _arr)
      { _str+='<tr class="acc_header off"><td>'+_key+'</td><td width="80%">'+_arr[_key]+'</td></tr>';})(keys, _res.data)}
    _str+='</table>';
    return(_str);
}

function display_listEnvironments(_res)
{
  let _str = ''; let _opt='';
  env1.empty(); env2.empty(); env3.empty(); env4.empty(); env5.empty(); env6.empty(); env7.empty(); env8.empty(); env9.empty(); env10.empty(); 
  _str = '<h3> List Environments results: </h3>';
  _str += '<table width="100%"><tr><th>#</th><th>Environment ID</th><th>Environment Name</th><th>Description</th></tr>';
  for (let each in _res.data.environments)
  {(function(_idx, _arr)
   {_str+='<tr class="acc_header off"><td>'+_idx+'</td><td>'+_arr[_idx].environment_id+'</td><td>'+_arr[_idx].name+'</td><td>'+_arr[_idx].description+'</td></tr>';
   _opt='<option value="'+_arr[_idx].environment_id+'">' +_arr[_idx].name+'</option>'; 
   env1.append(_opt); env2.append(_opt); env3.append(_opt); env4.append(_opt); env5.append(_opt); env6.append(_opt); env7.append(_opt); env8.append(_opt); env9.append(_opt); env10.append(_opt); 
   })(each, _res.data.environments);}
   _str+='</table>';
   env5.on('change', function ()
    {
      let _options = {};
      _options.environmentID = env5.find(':selected').val();
      postIt('/discovery/listCollections', 'env5.onChange', update_Coll_sel, d_target, _options);
     });
     env6.on('change', function ()
     {
       let _options = {};
       _options.environmentID = env6.find(':selected').val();
       postIt('/discovery/listConfigurations', 'env6.onChange', update_Conf_sel, d_target, _options);
      });
      env7.on('change', function ()
     {
      let _options = {};
      _options.environmentID = env7.find(':selected').val();
      postIt('/discovery/listCollections', 'env8.onChange', update_Coll_sel2, d_target, _options);
       });
       env8.on('change', function ()
       {
        let _options = {};
        _options.environmentID = env8.find(':selected').val();
        postIt('/discovery/listCollections', 'env8.onChange', update_Coll_sel3, d_target, _options);
         });
         env9.on('change', function ()
         {
          let _options = {};
          _options.environmentID = env9.find(':selected').val();
          postIt('/discovery/listCollections', 'env8.onChange', update_Coll_sel4, d_target, _options);
           });
           env10.on('change', function ()
           {
            let _options = {};
            _options.environmentID = env10.find(':selected').val();
            postIt('/discovery/listCollections', 'env10.onChange', update_Coll_sel5, d_target, _options);
             });
          return (_str);
}

function display_createEnvironment (_res)
{
  console.log(JSON.stringify(_res));
  d_target.empty(); let _str = ''; 
  d_target.append('<h3> Create Environment results for: '+_res.data.name+'</h3>');
  d_target.append(prettyPrint( _res.data, {maxDepth: 10} ));
  return('');
}

function display_listConfigurations (_res) 
{
  conf_id.empty(); 
  let _str = '<h3> List Configurations results: </h3>';
  _str += '<table width="100%"><tr><th>#</th><th>Configuration ID</th><th>Environment Name</th><th>Description</th><th>Created</th><th>Last Updated</th></tr>';
  for (let each in _res.data.configurations)
  {(function(_idx, _arr)
   {_str+='<tr class="acc_header off"><td>'+_idx+'</td><td>'+_arr[_idx].configuration_id+'</td><td>'+_arr[_idx].name+'</td><td>'+_arr[_idx].description+'</td><td>'+_arr[_idx].created+'</td><td>'+_arr[_idx].updated+'</td></tr>';
   let _opt='<option value="'+_arr[_idx].configuration_id+'">' +_arr[_idx].name+'</option>'; 
   conf_id.append(_opt);  
   })(each, _res.data.configurations);}
   _str+='</table>';
   return (_str);
}

function display_getConfigurationDetails (_res) 
{
  d_target.empty(); let _str = ''; 
  _str = '<h3> List Configuration Details for: '+_res.data.name+'</h3>';
  _str += '<table width="100%"><tr><th>Object</th><th>Value</th></tr>';
  for (let keys in _res.data)
  {(function(_key, _arr)
    { _str+='<tr class="acc_header off"><td>'+_key+'</td><td width="80%">'+_arr[_key]+'</td></tr>';})(keys, _res.data)}
  _str+='</table>';
  d_target.append(_str);
  d_target.append('<h4>Conversions</h4>');
  d_target.append(prettyPrint( _res.data.conversions, {maxDepth: 10}));

  d_target.append('<h4>Enrichments</h4>');
  d_target.append(prettyPrint( _res.data.enrichments, {maxDepth: 10} ));

  return('');
}
function display_listCollections (_res) 
{
  console.log(_res.data);
  col_id.empty(); 
  let _str = '<h3> List Configurations results: </h3>';
  _str += '<table width="100%"><tr><th>#</th><th>Collection ID</th><th>Environment Name</th><th>Description</th><th>Status</th><th>Language</th></tr>';
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      _str += '<tr><td>'+_idx+'</td><td>'+_arr[_idx].collection_id+'</td><td>'+_arr[_idx].name+'</td><td>'+_arr[_idx].description+'</td><td>'+_arr[_idx].status+'</td><td>'+_arr[_idx].language+'</td></tr>';
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id.append(_opt);  
       })(each, _res.data.collections)
  }
  _str +='</table>';
  return(_str);
}
function display_getCollectionDetails (_res) 
{
  console.log(JSON.stringify(_res));
  d_target.empty(); let _str = ''; 
  d_target.append('<h3> List Collection results for: '+_res.data.name+'</h3>');
  d_target.append(prettyPrint( _res.data, {maxDepth: 10} ));
  return('');
}
function update_Conf_sel (_res)
{
  for (let each in _res.data.configurations)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].configuration_id+'">' +_arr[_idx].name+'</option>'; 
      conf_id2.append(_opt);  
       })(each, _res.data.configurations)
  }
  return('');
}
function update_Coll_sel (_res)
{
  console.log(_res);
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id.append(_opt);  
       })(each, _res.data.collections)
  }
  return('');
}
function update_Coll_sel2 (_res)
{
  console.log(_res);
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id2.append(_opt);  
       })(each, _res.data.collections)
  }
  return('');
}
function update_Coll_sel3 (_res)
{
  console.log(_res);
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id3.append(_opt);  
       })(each, _res.data.collections)
  }
  return('');
}
function update_Coll_sel4 (_res)
{
  console.log(_res);
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id4.append(_opt);  
       })(each, _res.data.collections)
  }
  return('');
}
function update_Coll_sel5 (_res)
{
  console.log(_res);
  for (let each in _res.data.collections)
  {
    (function(_idx, _arr)
    {
      let _opt='<option value="'+_arr[_idx].collection_id+'">' +_arr[_idx].name+'</option>'; 
      col_id5.append(_opt);  
       })(each, _res.data.collections)
  }
  return('');
}
function display_createCollection (_res) 
{
  console.log(JSON.stringify(_res));
  d_target.empty(); let _str = ''; 
  d_target.append('<h3> Create Collection results for: '+_res.data.name+'</h3>');
  d_target.append(prettyPrint( _res.data, {maxDepth: 10} ));
  return('');
}
function display_deleteCollection (_res) 
{
  console.log(JSON.stringify(_res));
  d_target.empty(); let _str = ''; 
  d_target.append('<h3> Delete Collection results for: '+_res.data.name+'</h3>');
  d_target.append(prettyPrint( _res.data, {maxDepth: 10} ));
  return('');
}
function getDocumentList()
{
  let _method = 'getDocumentList';
  getIt('/discovery/getDocumentList', _method, display_getDocumentList, d_target);
}
function display_getDocumentList(_res)
{
  let _method = 'display_getDocumentList';
  let _str = '<table width="100%"><tr><th>Name</th><th>In Collection?</th></tr>';
  doc_name.empty(); doc_name2.empty();
  for (let each in _res.data.documents)
  {
    (function (_idx, _arr){
      let _col = (_arr[_idx].uploaded === "") ? 'No' : _arr[_idx].uploaded;
      _str +='<tr><td>'+_arr[_idx].file+'</td><td><center>'+_col+'</center></td></tr>'
      if (_arr[_idx].uploaded === "")
      {let _opt='<option value="'+_arr[_idx].file+'">' +_arr[_idx].file+'</option>'; 
      doc_name.append(_opt); } 
      else {let _opt='<option value="'+_arr[_idx].document_id+'">' +_arr[_idx].file+'</option>'; 
      doc_name2.append(_opt);}
    })(each, _res.data.documents)
  }
  _str += '</table>';
  return (_str);
}
function addDocument()
{
  let _method = 'addDocument';
  let _options = {};
  _options.environmentID = env8.find(':selected').val();
  _options.fileName = doc_name.find(':selected').val();
  _options.collectionID = col_id3.val();
  _options.collectionName = col_id3.text();
  console.log(_options);
  postIt('/discovery/addDocument', _method, display_addDocument, d_target, _options);
}
function display_addDocument(_res)
{
  let _str = _res.data.add;
  console.log(_res.data);
  console.log('_res.data.fileName =>'+_res.data.fileName+'<=');
  $('#doc_name option[value="'+_res.data.fileName+'"]').remove();
  return (_str);
}

function getDocumentDetails()
{
  let _method = 'getDocumentDetails';
  let _options = {};
  _options.environmentID = env9.find(':selected').val();
  _options.documentID = doc_name2.find(':selected').val();
  _options.collectionID = col_id4.val();
  console.log(_options);
  postIt('/discovery/getDocumentDetails', _method, display_getDocumentDetails, d_target, _options);
}
function display_getDocumentDetails(_res)
{
  console.log(_res);
  let _str = '<table width="100%"><tr><th>Object</th><th>Value</th></tr>';
  for (let keys in _res.data)
  {(function(_key, _arr)
    { _str+='<tr class="acc_header off"><td>'+_key+'</td><td width="80%">'+_arr[_key]+'</td></tr>';})(keys, _res.data)}
  _str+='</table>';
  return(_str);
}
function find()
{
  d_target.empty(); d_target.append("<center><img src='icons/loading.gif' /></center>")
  let _method = 'find';
  let _options = {};
  _options.environmentID = env10.find(':selected').val();
  _options.collectionID = col_id5.find(':selected').val();
  _options.queryString=$('#query').val();
  console.log(_method, _options);
  postIt('/discovery/queryCollection', _method, display_find, d_target, _options);
}
