'use strict';
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
 * @param {string} [options.token] - the authentication token
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getAuthMounts = Promise.method(function getAuthMounts(options) {
  options = options || {};

  return this.getAuthEndpoint()
    .get({
      headers: this.headers,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function gotAuths(auths) {
      this.auths = auths.data;
      return this.auths;
    });
});

/**
 * @method deleteAuthMount
 * @desc Deletes the specified authentication backend mount from the vault and sets internal property accordingly
 *
 * @param {string} options.id - unique identifier for the auth mount
 * @param {string} [options.token] - the authentication token
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteAuthMount = Promise.method(function deleteAuthMount(options) {
  options = options || {};

  return this.getAuthEndpoint()
    .delete({
      id: options.id,
      headers: this.headers,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function () {
      this.emit('unmount', options.id);
      return this.getAuthMounts({token: options.token});
    });
});

/**
 * @method createAuthMount
 * @desc Creates the specified authentication backend mount in the vault and sets internal property accordingly
 *
 * @param {string} options.id - unique identifier for the auth mount
 * @param {string} options.body.type - the type of auth ('app-id')
 * @param {string} [options.body.description] - a description of the auth backend for operators.
 * @param {string} [options.token] - the authentication token
 * @resolve {[Auths]} Resolves with current list of mounted auth backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createAuthMount = Promise.method(function createAuthMount(options) {
  options = options || {};

  return this.getAuthEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function () {
      this.emit('mount', options.body.type, options.id);
      return this.getAuthMounts({token: options.token});
    });
});
