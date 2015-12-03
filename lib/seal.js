
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * Gets the sealed status of a vault and sets internal property accordingly
 *
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'status' property updated.
 */
Vaulted.getSealedStatus = Promise.method(function getSealedStatus() {
  return this.api.getEndpoint('sys/seal-status')
    .get()
    .promise()
    .bind(this)
    .then(this.setStatus);
});

/**
 * Seals the vault
 *
 * @return {Promise<Vaulted>} promise is resolved with bound instance
 */
Vaulted.seal = Promise.method(function() {
  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (this.status.sealed) {
    return Promise.resolve(this);
  }
  return this.api.getEndpoint('sys/seal')
    .put({
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(this.getSealedStatus);
});

/**
 * Unseals the vault
 *
 * @return {Promise<Vaulted>} promise is resolved with bound instance
 */
Vaulted.unSeal = Promise.method(function unSeal() {
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
});
