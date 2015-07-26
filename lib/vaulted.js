var
  _ = require('lodash'),
  Endpoint = require('./endpoint.js'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};

  this.config = vaulted_config(config);

  this.sealed = true;
  this.config.set('headers', {
    'X-Vault-Token': null
  });

}

Vault.prototype.getAPI = function getAPI(api_name) {
  var api;

  api_name = _.isString(api_name) ? api_name : 'sys';

  try {
    api = this.config.get('api')[api_name];
    if(_.isUndefined(api)) {
      throw new Error('API definition is undefined');
    }
  } catch (ex) {
    throw new Error('Could not get API for \"' + api_name + '\"' + '\n' + ex.message);
  }
  return api;
};

Vault.prototype.getSealedStatus = function getSealedStatus() {
  var sys = this.getAPI();
  console.dir(sys);
};


