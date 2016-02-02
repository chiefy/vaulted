'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
 * @module backend/secret
 * @extends Vaulted
 * @desc Provides implementation for the Vault Secret APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getSecretEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/:id'), 'secret');
  _.extend(Proto, Vaulted);
};

/**
 * @method write
 * @desc Write a secret to the generic backend
 *
 * @param {string} options.id - unique identifier for the secret
 * @param {Object} options.body - containing the structure of the secret to store
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=secret] - path name the generic secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.write = Promise.method(function writeSecret(options, mountName) {
  options = options || {};

  return this.getSecretEndpoint(mountName)
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method read
 * @desc Read / get a secret from the generic backend
 *
 * @param {string} options.id - unique identifier for the secret
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=secret] - path name the generic secret backend is mounted on
 * @resolve {Secret} Resolves with the secret
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.read = Promise.method(function readSecret(options, mountName) {
  options = options || {};

  return this.getSecretEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method delete
 * @desc Delete a secret from the generic backend
 *
 * @param {string} options.id - unique identifier for the secret
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=secret] - path name the generic secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.delete = Promise.method(function deleteSecret(options, mountName) {
  options = options || {};

  return this.getSecretEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});
