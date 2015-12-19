var
  _ = require('lodash'),
  create_config = require('./config'),
  internal = require('./internal'),
  API = require('./api');

/**
  * @module vaulted
  * @desc Vaulted is a nodejs-based wrapper for the Vault HTTP API.
  * @author Christopher 'Chief' Najewicz <chief@beefdisciple.com>
  *
 */

module.exports = Vaulted;

/**
 * Vaulted constructor
 *
 * @constructor
 * @param {Object} config overrides any configuration set by node-convict setup.
 */
function Vaulted(config) {
  config = config || {};

  /** @member {Object} */
  this.config = create_config(config);
  /** @member {API} */
  this.api = new API(this.config);
  /** @member {Object} */
  this.status = {
    sealed: true
  };
  /** @member {string} */
  this.token = null;
  /** @member {Array} */
  this.keys = [];
  /** @member {Object} */
  this.auths = {};
  /** @member {Object} */
  this.mounts = {};
  /** @member {Array} */
  this.policies = [];
  /** @member {Object} */
  this.headers = {};
  /** @member {boolean} */
  this.initialized = false;
}

/**
 * @method prepare
 * @desc Attempt to load the Vault state.
 *
 * @resolve {Vaulted} Resolves with current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.prototype.prepare = function prepare() {
  return internal.loadState(this);
};

/**
 * @method setToken
 * @desc Sets the token to use when accessing the vault,
 * also sets the 'X-Vault-Token' header with token value
 *
 * @param {String} vault_token - the root/master token
 * @returns {Vaulted} instance of Vaulted
 * @throws {Error} - Vault token not provided, or has zero-length.
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
 * @method setKeys
 * @desc Sets the keys to use when sealing and unsealing the vault.
 *
 * @param {Array} keys - shares of the master key
 * @returns {Vaulted} instance of Vaulted
 * @throws {Error} - Vault keys not provided, or is empty list.
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
 * @method setStatus
 * @desc Set status hash
 *
 * @param {Object} status - representing vaulted status, which includes 'sealed' property.
 * @returns {Vaulted} instance of Vaulted
 */
Vaulted.prototype.setStatus = function setStatus(status) {
  if (_.isPlainObject(status) && _.has(status, 'sealed')) {
    this.status = status;
  }
  return this;
};

/**
 * @method validateEndpoint
 * @desc Validate the request endpoint and that the Vault is prepared for use.
 *
 * @param {string} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 * @throws {Error} - Vault has not been initialized.
 * @throws {Error} - Vault has not been unsealed.
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
require('./policy')(Vaulted.prototype);
require('./auth')(Vaulted.prototype);
require('./auth/token')(Vaulted.prototype);
require('./auth/appid')(Vaulted.prototype);
require('./keys')(Vaulted.prototype);
require('./audit')(Vaulted.prototype);
require('./health')(Vaulted.prototype);
require('./leader')(Vaulted.prototype);
require('./backends/consul')(Vaulted.prototype);
