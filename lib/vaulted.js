'use strict';
var
  _ = require('lodash'),
  events = require('events'),
  util = require('util'),
  config = require('./config'),
  internal = require('./internal'),
  API = require('./api');

/**
 * @module vaulted
 * @desc Vaulted is a nodejs-based wrapper for the Vault HTTP API.
 * @author Christopher 'Chief' Najewicz <chief@beefdisciple.com>
 *
 */

/**
 * Vaulted constructor
 *
 * @constructor
 * @param {Object} options overrides any default configurations.
 */
function Vaulted(options) {
  events.EventEmitter.call(this);

  /** @member {Object} */
  this.config = config(options);
  /** @member {API} */
  this.api = new API(this.config);
  /** @member {Object} */
  this.status = {
    sealed: true
  };
  /** @member {string} */
  this.token = null;
  /** @member {Object} */
  this.auths = {};
  /** @member {Object} */
  this.mounts = {};
  /** @member {Object} */
  this.headers = {};
  /** @member {boolean} */
  this.initialized = false;

  if (this.config.has('vault_token')) {
    this.setToken(this.config.get('vault_token'));
  }

  this.enableListeners();
}

util.inherits(Vaulted, events.EventEmitter);

/**
 * @method prepare
 * @desc Attempt to load the Vault state.
 *
 * @param {String} [vault_token] - an auth token
 * @resolve {Vaulted} Resolves with current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.prototype.prepare = function prepare(vault_token) {
  return internal.loadState(this, vault_token);
};

/**
 * @method setInitialized
 * @desc Sets the initialized flag to true to indicated the Vault
 * has been intialized.
 *
 * @returns {Vaulted} instance of Vaulted
 */
Vaulted.prototype.setInitialized = function setInitialized() {
  this.initialized = true;
  return this;
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
  if (!_.isString(vault_token) || vault_token.length === 0) {
    throw new Error('Vault token not provided, or has zero-length.');
  }
  this.token = vault_token;
  this.headers = {
    'X-Vault-Token': this.token
  };

  // having token means being initialized
  return this.setInitialized();
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
 * @param {string} [mountName] - path name an endpoint is mounted on
 * @param {string} [defaultName] - default path name an endpoint is mounted on
 * @return {EndPoint} An instance matching the specificed name.
 * @throws {Error} Vault has not been initialized.
 * @throws {Error} Vault has not been unsealed.
 */
Vaulted.prototype.validateEndpoint = function validateEndpoint(endpoint, mountName, defaultName) {
  if (!this.initialized) {
    throw new Error('Vault has not been initialized.');
  }
  if (this.status.sealed) {
    throw new Error('Vault has not been unsealed.');
  }
  if (mountName || defaultName) {
    endpoint = util.format(endpoint, mountName || defaultName);
  }

  return this.api.getEndpoint(endpoint);
};


// sys
require('./sys/auth')(Vaulted.prototype);
require('./sys/audit')(Vaulted.prototype);
require('./sys/health')(Vaulted.prototype);
require('./sys/init')(Vaulted.prototype);
require('./sys/keys')(Vaulted.prototype);
require('./sys/leader')(Vaulted.prototype);
require('./sys/leases')(Vaulted.prototype);
require('./sys/mounts')(Vaulted.prototype);
require('./sys/policy')(Vaulted.prototype);
require('./sys/seal')(Vaulted.prototype);

// auth backends
require('./auth/token')(Vaulted.prototype);
require('./auth/appid')(Vaulted.prototype);
require('./auth/github')(Vaulted.prototype);

// secrets backends
require('./backends/secret')(Vaulted.prototype);
require('./backends/cubbyhole')(Vaulted.prototype);
require('./backends/consul')(Vaulted.prototype);
require('./backends/pki')(Vaulted.prototype);

// internal events
require('./listeners')(Vaulted.prototype);

module.exports = Vaulted;

