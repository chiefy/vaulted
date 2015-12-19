var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module auth
  * @extends Vaulted
  * @desc Provides implementation for the Vault Auth APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getAuthEndpoint = _.partial(Proto.validateEndpoint, 'sys/auth/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method getAuthMounts
 * @desc Gets the list of authentication backend mounts for the vault and sets internal property accordingly
 *
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getAuthMounts = Promise.method(function getAuthMounts() {
  return this.getAuthEndpoint()
    .get({
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function gotAuths(auths) {
      this.auths = auths;
      return this.auths;
    });
});

/**
 * @method deleteAuthMount
 * @desc Deletes the specified authentication backend mount from the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the auth mount
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteAuthMount = Promise.method(function deleteAuthMount(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide auth mount id.'));
  }

  return this.getAuthEndpoint()
    .delete({
      id: options.id,
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(this.getAuthMounts);
});

/**
 * @method createAuthMount
 * @desc Creates the specified authentication backend mount in the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the auth mount
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.type - the type of auth ('app-id')
 * @param {string} [options.body.description] - a description of the auth backend for operators.
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createAuthMount = Promise.method(function createAuthMount(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide auth mount id.'));
  }

  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide auth mount details.'));
  }

  if (_.isUndefined(options.body.type) || !options.body.type) {
    return Promise.reject(new Error('You must provide auth mount type.'));
  }

  return this.getAuthEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: {
        type: options.body.type,
        description: options.body.description
      }
    })
    .promise()
    .bind(this)
    .then(this.getAuthMounts);
});
