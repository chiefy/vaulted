var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
 * @module leases
 * @extends Vaulted
 * @desc Provides implementation for the Vault Renew/Revoke Leases APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getLeaseRenewEndpoint = _.partial(Proto.validateEndpoint, 'sys/renew/:id');
  Vaulted.getLeaseRevokeEndpoint = _.partial(Proto.validateEndpoint, 'sys/revoke/:id');
  Vaulted.getLeaseRevokePrefixEndpoint = _.partial(Proto.validateEndpoint, 'sys/revoke-prefix/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method renewLease
 * @desc Renew the lease (extend) on a secret
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the lease
 * @param {Object} [options.body] - holds the attributes passed as inputs
 * @param {string} [options.body.increment] - requested amount of time in seconds to extend the lease.
 * @param {string} [options.token] - the authentication token
 * @return {Promise<Object>} Promise which is resolved to the renewed secret.
 */
Vaulted.renewLease = Promise.method(function renewLease(options) {
  options = options || {};

  return this.getLeaseRenewEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method revokeLease
 * @desc Revoke the lease on a secret immediately.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the lease
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeLease = Promise.method(function revokeLease(options) {
  options = options || {};

  return this.getLeaseRevokeEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method revokeLeasePrefix
 * @desc Revoke the lease on all secrets under the specified prefix immediately.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - secret path prefix
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeLeasePrefix = Promise.method(function revokeLeasePrefix(options) {
  options = options || {};

  return this.getLeaseRevokePrefixEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});
