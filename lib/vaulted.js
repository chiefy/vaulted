var
  _ = require('lodash'),
  create_config = require('./config.js'),
  internal = require('./internal'),
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
  this.token = null;
  this.keys = [];
  this.mounts = {};
  this.headers = {};
  this.initialized = false;
}

/**
 * Attempt to load the Vault state.
 *
 * @return {Promise<Vaulted>} promise is resolved with bound instance
 */
Vaulted.prototype.prepare = function prepare() {
  return internal.loadState(this);
};

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
 * Sets the keys to use when sealing and unsealing the vault.
 *
 * @param {Array} keys
 * @returns {Vaulted} returns bound instance
 */
Vaulted.prototype.setKeys = function setKeys(keys) {
  if (!_.isArray(keys) || keys.length === 0) {
    throw new Error('Vault keys not provided, or is empty list.');
  }

  this.keys = keys;
  // having keys means being initialized
  this.initialized = true;

  return this;
};

/**
 * Set status hash
 *
 * @param {Object} status Object representing status, which includes 'sealed' property.
 * @return {Vaulted} Current instance
 */
Vaulted.prototype.setStatus = function setStatus(status) {
  if (_.isPlainObject(status) && _.has(status, 'sealed')) {
    this.status = status;
  }
  return this;
};

/**
 * Validate the request endpoint and that the Vault is prepared for use.
 *
 * @param {String} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 */
Vaulted.prototype.validateEndpoint = function validateEndpoint(endpoint) {
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
require('./backends/consul')(Vaulted.prototype);
