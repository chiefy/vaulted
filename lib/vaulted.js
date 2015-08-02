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
  this.initialized = false;
}

/**
 * Initializes a remote vault
 *
 * @param  {Object}   options   Overrides sent to API command, 'secret_shares' and 'secret_threshold', both {Number}
 * @return {Promise}  Promise which is resolved with current instance of Vaulted. Populates keys and tokens properties.
 */
Vaulted.prototype.init = function init(options) {
  if (this.initialized === true) {
    return Promise.reject(new Error('Vault is already initialized.'));
  }

  options = _.defaults(options || {}, {
    secret_shares: this.config.get('secret_shares'),
    secret_threshold: this.config.get('secret_threshold')
  });

  return this.api.getEndpoint('sys/init')
    .put({
      body: options
    })
    .promise()
    .bind(this)
    .then(function keysAndToken(keys_and_token) {
      this.keys = keys_and_token.keys;
      this.token = keys_and_token.root_token;
      this.initialized = true;
      this.headers = {
        'X-Vault-Token': this.token
      };
      return this;
    });
};

/**
 * Gets the sealed status of a vault and sets internal property accordingly
 *
 * @return {Promise} Promise which is resolved with current instance of Vaulted with 'status' property updated.
 */
Vaulted.prototype.getSealedStatus = function getSealedStatus() {
  this.api.getEndpoint('sys/seal-status')
    .get()
    .promise()
    .bind(this)
    .then(this.setStatus);
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

Vaulted.prototype.seal = function() {
  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (this.status.sealed) {
    return Promise.resolve(this);
  }
  this.api.getEndpoint('sys/seal')
    .put()
    .promise()
    .bind(this)
    .then(function setSealed() {
      this.status.sealed = true;
      return this;
    });
};

Vaulted.prototype.unSeal = function unSeal() {
  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (!this.status.sealed) {
    return Promise.resolve(this);
  }
  return this.api.getEndpoint('sys/unseal')
    .put({
      body: {
        key: _.sample(this.keys)
      }
    })
    .promise()
    .bind(this)
    .then(this.setStatus)
    .then(this.unSeal);
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

Vaulted.prototype.getSecretEndpoint = _.partial(Vaulted.prototype.validateEndpoint, 'secret/:id');

Vaulted.prototype.write = function writeSecret(options) {
  options = options || {};
  if (_.isUndefined(options.body)) {
    return Promise.reject(new Error('You must provide an secret to write to the Vault.'));
  }
  return this.getSecretEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
};

Vaulted.prototype.read = function readSecret(options) {
  options = options || {};
  return this.getSecretEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
};

Vaulted.prototype.delete = function deleteSecret(options) {
  options = options || {};
  return this.getSecretEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
};

