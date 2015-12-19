var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module secret
  * @extends Vaulted
  * @desc Provides implementation for the Vault Secret APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getSecretEndpoint = _.partial(Proto.validateEndpoint, 'secret/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method write
 * @desc Write a secret to the generic backend
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @param {Object} options.body - containing the structure of the secret to store
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.write = Promise.method(function writeSecret(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide secret id.'));
  }
  if (_.isUndefined(options.body)  || !options.body) {
    return Promise.reject(new Error('You must provide an secret to write to the Vault.'));
  }
  return this.getSecretEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method read
 * @desc Read / get a secret from the generic backend
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @resolve {Secret} Resolves with the secret
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.read = Promise.method(function readSecret(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide secret id.'));
  }
  return this.getSecretEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method delete
 * @desc Delete a secret from the generic backend
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.delete = Promise.method(function deleteSecret(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide secret id.'));
  }
  return this.getSecretEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
});
