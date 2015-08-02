
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getSecretEndpoint = _.partial(Proto.validateEndpoint, 'secret/:id');
  _.extend(Proto, Vaulted);
};

/**
 * Write a secret to the generic backend
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise<Object>}         Promise which resolves with secret object returned from server
 */
Vaulted.write = function writeSecret(options) {
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

/**
 * Read / get a secret from the generic backend
 *
 * @param  {Object} options Options hash, "id" is required
 * @return {Promise<Object>}         Promise which resolves to the secret or rejects when secret is not found
 */
Vaulted.read = function readSecret(options) {
  options = options || {};
  return this.getSecretEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
};

/**
 * Delete a secret from the generic backend
 *
 * @param  {Object} options Options hash, "id" is required
 * @return {Promise<Object>}         Promise which resolves with status of deletion
 */
Vaulted.delete = function deleteSecret(options) {
  options = options || {};
  return this.getSecretEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
};


