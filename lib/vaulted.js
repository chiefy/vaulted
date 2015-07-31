var
  _ = require('lodash'),
  Promise = require('bluebird'),
  vaulted_config = require('./config.js');

module.exports = Vaulted;

function Vaulted(config) {
  config = config || {};

  this.config = vaulted_config(config);
  this.api = require('./api.js')(this.config);
  this.status = {
    sealed: true
  };
  this.initialized = false;
}

Vaulted.prototype.getAPI = function getAPI(api_prefix) {
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

Vaulted.prototype.getEndpoint = function getEndpoint(endpoint_name) {
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


Vaulted.prototype.init = function init(options) {
  if (this.initialized === true) {
    return Promise.reject(new Error('Vault is already initialized.'));
  }
  options = _.defaults(options || {}, {
    secret_shares: this.config.get('secret_shares'),
    secret_threshold: this.config.get('secret_threshold')
  });

  return this.getEndpoint('sys/init')
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

Vaulted.prototype.getSealedStatus = function getSealedStatus() {
  this.getEndpoint('sys/seal-status')
    .get()
    .promise()
    .bind(this)
    .then(this.setStatus);
};

Vaulted.prototype.setStatus = function(status) {
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
  this.getEndpoint('sys/seal')
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
  return this.getEndpoint('sys/unseal')
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
  return this.getEndpoint(endpoint);
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