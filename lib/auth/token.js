'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module auth/token
  * @extends Vaulted
  * @desc Provides implementation for the Vault Auth Token backend APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getCreateTokenEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/create'), 'token');
  Vaulted.getTokenRenewEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/renew/:id'), 'token');
  Vaulted.getTokenRenewSelfEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/renew-self'), 'token');
  Vaulted.getTokenLookupSelfEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/lookup-self'), 'token');
  Vaulted.getTokenLookupEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/lookup/:id'), 'token');
  Vaulted.getTokenRevokeSelfEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/revoke-self'), 'token');
  Vaulted.getTokenRevokeEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/revoke/:id'), 'token');
  Vaulted.getTokenRevokeOrphanEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/revoke-orphan/:id'), 'token');
  Vaulted.getTokenRevokePrefixEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/revoke-prefix/:id'), 'token');
  _.extend(Proto, Vaulted);
};

/**
 * @method createToken
 * @desc Creates a token to use for authenticating with the Vault.
 *
 * @param {string} [options.body.id] - ID of the client token
 * @param {Array} [options.body.policies] - list of policies for the token
 * @param {Object} [options.body.meta] - map of string to string valued metadata
 * @param {boolean} [options.body.no_parent] - creates a token with no parent
 * @param {boolean} [options.body.no_default_profile] - default profile will not be a part of this token's policy set
 * @param {string} [options.body.ttl] - TTL period of the token
 * @param {string} [options.body.display_name] - display name of the token
 * @param {number} [options.body.num_uses] - maximum uses for the given token
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createToken = Promise.method(function createToken(options, mountName) {
  options = options || {};

  return this.getCreateTokenEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method renewToken
 * @desc Renew an existing token to use for authenticating with the Vault.
 *
 * @param {string} options.id - unique identifier for the token
 * @param {number} [options.body.increment] - lease increment
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.renewToken = Promise.method(function renewToken(options, mountName) {
  options = options || {};

  return this.getTokenRenewEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method renewTokenSelf
 * @desc Renews the token used by this client.
 *
 * @param {number} [options.body.increment] - lease increment
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.renewTokenSelf = Promise.method(function renewSelf(options, mountName) {
  options = options || {};

  return this.getTokenRenewSelfEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method lookupToken
 * @desc Retrieve information about the specified existing token.
 *
 * @param {string} options.id - unique identifier for the token
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.lookupToken = Promise.method(function lookupToken(options, mountName) {
  options = options || {};

  return this.getTokenLookupEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method revokeToken
 * @desc Revokes the specified existing token and all child tokens.
 *
 * @param {string} options.id - unique identifier for the token
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeToken = Promise.method(function revokeToken(options, mountName) {
  options = options || {};

  return this.getTokenRevokeEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method revokeTokenOrphan
 * @desc Revokes the specified existing token but not the child tokens.
 *
 * @param {string} options.id - unique identifier for the token
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenOrphan = Promise.method(function revokeTokenOrphan(options, mountName) {
  options = options || {};

  return this.getTokenRevokeOrphanEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method revokeTokenPrefix
 * @desc Revokes all tokens generated at a given prefix including children and secrets.
 *
 * @param {string} options.id - token prefix
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenPrefix = Promise.method(function revokeTokenPrefix(options, mountName) {
  options = options || {};

  return this.getTokenRevokePrefixEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method lookupTokenSelf
 * @desc Retrieve information about the current client token.
 *
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.lookupTokenSelf = Promise.method(function lookupTokenSelf(options, mountName) {
  options = options || {};

  return this.getTokenLookupSelfEndpoint(mountName)
    .get({
      headers: this.headers,
      _token: options.token
    });
});

/**
 * @method revokeTokenSelf
 * @desc Revokes the current client token and all child tokens.
 *
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=token] - path name the token auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenSelf = Promise.method(function revokeTokenSelf(options, mountName) {
  options = options || {};

  return this.getTokenRevokeSelfEndpoint(mountName)
    .post({
      headers: this.headers,
      _token: options.token
    });
});
