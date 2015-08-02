var
  _ = require('lodash'),
  Promise = require('bluebird'),
  create_config = require('./config.js'),
  API = require('./api.js');

module.exports = Vaulted;

/**
 * Vaulted constructor
 *
 * @constructor
 * @param {Object} config overrides any configuration set by node-convict setup.
 */
function Vaulted(config) {
  config = config || {};

  this.config = create_config(config);
  this.api = new API(this.config);
  this.status = {
    sealed: true
  };
  this.headers = {};
  this.initialized = false;
}

/**
 * Sets the token to use when accessing the vault,
 * also sets the 'X-Vault-Token' header with token value
 *
 * @param {String} vault_token
 * @returns {Vaulted} returns bound instance
 */
Vaulted.prototype.setToken = function setToken(vault_token) {
  if(!_.isString(vault_token) || vault_token.length === 0) {
    throw new Error('Vault token not provided, or has zero-length.');
  }
  this.token = vault_token;
  this.headers = {
    'X-Vault-Token': this.token
  };
  return this;
};

/**
 * Set status hash
 *
 * @param {Object} status Object representing status, which includes 'sealed' property.
 * @return {Vaulted} Current instance
 */
Vaulted.prototype.setStatus = function setStatus(status) {
  status = status || {};
  this.status = status;
  return this;
};


Vaulted.prototype.validateEndpoint = function validateEndpoint(endpoint) {
  if(!_.isString(endpoint) || endpoint.length === 0) {
    throw new Error('Endpoint not provided or has no length.');
  }
  if (!this.initialized) {
    throw new Error('Vault has not been initialized.');
  }
  if (this.status.sealed) {
    throw new Error('Vault has not been unsealed.');
  }
  return this.api.getEndpoint(endpoint);
};


require('./seal')(Vaulted.prototype);
require('./init')(Vaulted.prototype);
require('./secret')(Vaulted.prototype);
require('./mounts')(Vaulted.prototype);


