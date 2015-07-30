var
  _ = require('lodash'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};

  this.config = vaulted_config(config);
  this.api = require('./api.js')(this.config);
  this.sealed = true;
  this.config.set('headers', {
    'X-Vault-Token': null
  });

}

Vault.prototype.getAPI = function getAPI(api_prefix) {
  var api;

  api_prefix = _.isString(api_prefix) ? api_prefix : 'sys';

  try {
    api = this.api[api_prefix];
    if (_.isUndefined(api)) {
      throw new Error('API definition is undefined');
    }
  } catch (ex) {
    throw new Error('Could not get API for \"' + api_prefix + '\"' + '\n' + ex.message);
  }
  return api;
};

Vault.prototype.getEndpoint = function getEndpoint(endpoint_name) {
  if (!_.isString(endpoint_name) || (_.isString(endpoint_name) && endpoint_name.length === 0)) {
    throw new Error('Can not get endpoint for non-string value: ' + endpoint_name);
  }
  var
    endpoint_info = endpoint_name.split('/'),
    api = this.getAPI(endpoint_info[0]),
    endpoint = _.find(api, {
      name: endpoint_name
    });

  if (_.isUndefined(endpoint)) {
    throw new Error('Could not find endpoint: ' + endpoint_name + ' in API defintions');
  }
  return endpoint;
};

Vault.prototype.getSealedStatus = function getSealedStatus() {
  var api_call = this.getEndpoint('sys/seal-status');
  api_call
    .get()
    .then(console.dir);

};
