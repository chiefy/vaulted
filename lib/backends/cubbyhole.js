var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
 * @module cubbyhole
 * @extends Vaulted
 * @desc Provides implementation for the Vault Cubbyhole APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getCubbyEndpoint = _.partial(Proto.validateEndpoint, 'cubbyhole/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method writeCubby
 * @desc Stores a secret at the specified location
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @param {Object} options.body - containing the structure of the secret to store
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.writeCubby = Promise.method(function writeCubby(options) {
  options = options || {};

  return this.getCubbyEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method readCubby
 * @desc Retrieves the secret at the specified location
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @param {string} [options.token] - the authentication token
 * @resolve {Secret} Resolves with the secret
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.readCubby = Promise.method(function readCubby(options) {
  options = options || {};

  return this.getCubbyEndpoint()
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method deleteCubby
 * @desc Delete secret at the specified location
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteCubby = Promise.method(function deleteCubby(options) {
  options = options || {};

  return this.getCubbyEndpoint()
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});
