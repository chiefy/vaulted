var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  Endpoint;

module.exports = API;

/**
 * API constructor
 *
 * @constructor
 * @param {Object} config overrides any configuration set by node-convict setup.
 */
function API(config) {
  if(_.isUndefined(config) || _.isUndefined(config.get)) {
    throw new Error('API must be instantiated with a node-convict based object');
  }
  Endpoint = require('./endpoint')(config);
  _.extend(this, this._loadAPIDefinitions(config));
}

API.prototype._readConfigFromPath = function _readConfigFromPath(config, api, apidef) {
  var
    prefix = config.get('prefix'),
    filename = path.basename(apidef),
    api_type,
    partial,
    parsed_api;

  try {
    api_type = filename.split('_')[1].split('.')[0];
  } catch (ex) {
    throw new Error('Invalid file name at: ' + filename + ' must be in the form: "api_<name>.json"');
  }

  try {
    parsed_api = JSON.parse(fs.readFileSync(apidef));
  } catch (ex) {
    throw new Error('Could not read API definition file at: ' + filename + ' ' + ex.message);
  }

  if (_.isUndefined(parsed_api[prefix])) {
    throw new Error('Could not find API definition at: ' + filename + ' for prefix: ' + prefix);
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
  var api = _.get(this, api_type);
  if (_.isUndefined(api)) {
    throw new Error('Could not get API for \"' + api_type + '\"');
  }
  return api;
};

/**
 * Retrieves the named endpoint.
 *
 * @param {String} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 */
API.prototype.getEndpoint = function getEndpoint(endpoint_name) {
  if (!_.isString(endpoint_name) || endpoint_name.length === 0) {
    throw new Error('Endpoint not provided or has no length.');
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
