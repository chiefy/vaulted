var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint = require('./endpoint.js'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};
  this.config = vaulted_config(config);
  this.config.set('apis', this.load_api());
  this.config.set('headers', {
    'X-Vault-Token': null
  })
}

Vault.prototype.load_api = function(path) {
  var
    prefix = this.config.get('prefix'),
    api_def = null,
    api_collection = {};

  if (_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  try {
    api_def = JSON.parse(fs.readFileSync(path));
  } catch (ex) {
    throw new Error('Could not read API definition file at: ' + path + ' ' + ex.message);
  }

  api_def = api_def[prefix];

  if (_.isUndefined(api_def)) {
    throw new Error('Could not find API definition at: ' + path + ' for prefix: ' + prefix);
  }

  function reduceAPI(endpoints, cur_def) {
    endpoints[def.name] = Endpoint.create(this.config, def);
    return endpoints;
  }
  api_collection = _.reduce(api_def, reduceAPI.bind(this), Object.create(null));

  return api_collection;
};
