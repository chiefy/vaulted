
var
  Vaulted = {},
  _ = require('lodash');

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * Gets the sealed status of a vault and sets internal property accordingly
 *
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'status' property updated.
 */
Vaulted.getSealedStatus = function getSealedStatus() {
  this.api.getEndpoint('sys/seal-status')
    .get()
    .promise()
    .bind(this)
    .then(this.setStatus);
};

/**
 * Seals the vault
 *
 * @return {Promise<Vaulted>} promise is resolved with bound instance
 */
Vaulted.seal = function() {
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

Vaulted.unSeal = function unSeal() {
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

