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
    secret_shares: 3,
    secret_threshold: 2
  });
  return this.getEndpoint('sys/init')
    .put({
      body: options
    })
    .then(function keysAndToken(keys_and_token) {
      this.keys = keys_and_token.keys;
      this.token = keys_and_token.root_token;
      this.initialized = true;
      this.headers = {
        'X-Vault-Token': this.token
      };
      return this;
    }.bind(this));
};

Vaulted.prototype.getSealedStatus = function getSealedStatus() {
  this.getEndpoint('sys/seal-status')
    .get()
    .then(this.setStatus.bind(this));
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
    .then(function setSealed() {
      this.status.sealed = true;
    }.bind(this));
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
    .then(this.setStatus.bind(this))
    .then(this.unSeal.bind(this));
};

Vaulted.prototype.checkRequest = function checkRequest() {
  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (this.status.sealed) {
    return Promise.reject(new Error('Vault has not been unsealed.'));
  }
  return false;
};

Vaulted.prototype.write = function writeSecret(options) {
  options = options || {};
  var reject;

  if (_.isUndefined(options.body)) {
    return Promise.reject(new Error('You must provide an secret to write to the Vault.'));
  }
  reject = this.checkRequest();
  if (reject !== false) {
    return reject;
  }

  return this.getEndpoint('secret/:id')
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
};

Vaulted.prototype.read = function readSecret(options) {
  options = options || {};
  var reject = this.checkRequest();

  if (reject !== false) {
    return reject;
  }

  return this.getEndpoint('secret/:id')
    .get({
      headers: this.headers,
      id: options.id
    });
};

Vaulted.prototype.delete = function deleteSecret(options) {
  options = options || {};
  var reject = this.checkRequest();

  if (reject !== false) {
    return reject;
  }

  return this.getEndpoint('secret/:id')
    .delete({
      headers: this.headers,
      id: options.id
    });
};