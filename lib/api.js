var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint;

module.exports = API;

function API(config) {
  if(_.isUndefined(config) || _.isUndefined(config.get)) {
    throw new Error('API must be instantiated with a node-convict based object');
  }
  Endpoint = require('./endpoint')(config);
  _.extend(this, this._loadAPIDefinitions(config));
}

API.prototype._readConfigFromPath = function _readConfigFromPath(config, api, path) {
  var
    prefix = config.get('prefix'),
    api_type,
    partial,
    parsed_api;

  try {
    api_type = path.split('_')[1].split('.')[0];
    path =  __dirname + '/../' + path;
  } catch (ex) {
    throw new Error('Invalid file name at: ' + path + ' must be in the form: "api_<name>.json"');
  }

  try {
    parsed_api = JSON.parse(fs.readFileSync(path));
  } catch (ex) {
    throw new Error('Could not read API definition file at: ' + path + ' ' + ex.message);
  }

  if (_.isUndefined(parsed_api[prefix])) {
    throw new Error('Could not find API definition at: ' + path + ' for prefix: ' + prefix);
  }

  partial = _.partial(Endpoint.create, config.get('vault_url'));
  api[api_type] = _.map(parsed_api[prefix], partial);

  return api;
};

API.prototype._loadAPIDefinitions = function _loadAPIDefinitions(config) {
  if (_.isEmpty(config.get('prefix'))) {
    throw new Error('Could not get API version to load defintion file.');
  }
  return _.reduce(config.get('api_def_files'), _.bind(this._readConfigFromPath, this, config), {});
};

API.prototype._getDefinition = function _getDefinition(api_type) {
  api_type = _.isString(api_type) ? api_type : 'sys';
  var api;
  try {
    api = this[api_type];
    if (_.isUndefined(api)) {
      throw new Error('API definition is undefined');
    }
  } catch (ex) {
    throw new Error('Could not get API for \"' + api_type + '\"' + '\n' + ex.message);
  }
  return api;
};

API.prototype.getEndpoint = function getEndpoint(endpoint_name) {
  if (!_.isString(endpoint_name) || (_.isString(endpoint_name) && endpoint_name.length === 0)) {
    throw new Error('Can not get endpoint for non-string value: ' + endpoint_name);
  }
  var
    endpoint_info = endpoint_name.split('/'),
    api = this._getDefinition(endpoint_info[0]),
    endpoint = _.find(api, {
      name: endpoint_name
    });

  if (_.isUndefined(endpoint)) {
    throw new Error('Could not find endpoint: ' + endpoint_name + ' in API defintions');
  }
  return endpoint;
};

