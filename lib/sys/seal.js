'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
  * @module seal
  * @extends Vaulted
  * @desc Provides implementation for the Vault Seal APIs
  *
 */

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * @method getSealedStatus
 * @desc Gets the sealed status of a vault and sets internal property accordingly
 *
 * @resolve {Vaulted} Resolves with current instance of Vaulted after setting seal status
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getSealedStatus = Promise.method(function getSealedStatus() {
  return this.api.getEndpoint('sys/seal-status')
    .get()
    .promise()
    .bind(this)
    .then(this.setStatus);
});

/**
 * @method seal
 * @desc Seals the vault
 *
 * @param {Object} [options] - object of options to send to API request
 * @param {string} [options.token] - the authentication token
 * @resolve {Vaulted} Resolves with current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.seal = Promise.method(function(options) {
  options = options || {};

  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (this.status.sealed) {
    return Promise.resolve(this);
  }
  return this.api.getEndpoint('sys/seal')
    .put({
      headers: this.headers,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(this.getSealedStatus);
});

/**
 * @method unSeal
 * @desc Unseals the vault
 *
 * @param {Object} options - object of options to send to API request
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {Object} options.body.key - A single master share key
 * @param {Object} [options.body.reset] - if true, the previously-provided unseal
 * keys are discarded from memory and the unseal process is reset.
 * @resolve {Vaulted} Resolves with current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.unSeal = Promise.method(function unSeal(options) {
  options = utils.setDefaults(options);

  if (!this.initialized) {
    return Promise.reject(new Error('Vault has not been initialized.'));
  }
  if (!this.status.sealed) {
    this.emit('unsealed');
    return Promise.resolve(this);
  }

  return this.api.getEndpoint('sys/unseal')
    .put({
      body: options.body
    })
    .promise()
    .bind(this)
    .then(this.setStatus);
});
