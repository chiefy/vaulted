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
  Vaulted.getCreateTokenEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/create');
  Vaulted.getTokenRenewEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/renew/:id');
  Vaulted.getTokenLookupSelfEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/lookup-self');
  Vaulted.getTokenLookupEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/lookup/:id');
  Vaulted.getTokenRevokeSelfEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/revoke-self');
  Vaulted.getTokenRevokeEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/revoke/:id');
  Vaulted.getTokenRevokeOrphanEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/revoke-orphan/:id');
  Vaulted.getTokenRevokePrefixEndpoint = _.partial(Proto.validateEndpoint, 'auth/token/revoke-prefix/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method createToken
 * @desc Creates a token to use for authenticating with the Vault.
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} [options.body.id] - ID of the client token
 * @param {Array} [options.body.policies] - list of policies for the token
 * @param {Object} [options.body.meta] - map of string to string valued metadata
 * @param {boolean} [options.body.no_parent] - creates a token with no parent
 * @param {boolean} [options.body.no_default_profile] - default profile will not be a part of this token's policy set
 * @param {string} [options.body.ttl] - TTL period of the token
 * @param {string} [options.body.display_name] - display name of the token
 * @param {number} [options.body.num_uses] - maximum uses for the given token
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createToken = Promise.method(function createToken(options) {
  options = options || {};
  if (_.isUndefined(options.body)) {
    options.body = {};
  }

  return this.getCreateTokenEndpoint()
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method renewToken
 * @desc Renew an existing token to use for authenticating with the Vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the token
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {number} [options.body.increment] - lease increment
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.renewToken = Promise.method(function renewToken(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide client token.'));
  }
  if (_.isUndefined(options.body)) {
    options.body = {};
  }

  return this.getTokenRenewEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method lookupToken
 * @desc Retrieve information about the specified existing token.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the token
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.lookupToken = Promise.method(function lookupToken(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide client token.'));
  }

  return this.getTokenLookupEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method revokeToken
 * @desc Revokes the specified existing token and all child tokens.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeToken = Promise.method(function revokeToken(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide client token.'));
  }

  return this.getTokenRevokeEndpoint()
    .post({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method revokeTokenOrphan
 * @desc Revokes the specified existing token but not the child tokens.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenOrphan = Promise.method(function revokeTokenOrphan(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide client token.'));
  }

  return this.getTokenRevokeOrphanEndpoint()
    .post({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method revokeTokenPrefix
 * @desc Revokes all tokens generated at a given prefix including children and secrets.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - token prefix
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenPrefix = Promise.method(function revokeTokenPrefix(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide token prefix.'));
  }

  return this.getTokenRevokePrefixEndpoint()
    .post({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method lookupTokenSelf
 * @desc Retrieve information about the current client token.
 *
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.lookupTokenSelf = Promise.method(function lookupTokenSelf() {
  return this.getTokenLookupSelfEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * @method revokeTokenSelf
 * @desc Revokes the current client token and all child tokens.
 *
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeTokenSelf = Promise.method(function revokeTokenSelf() {
  return this.getTokenRevokeSelfEndpoint()
    .post({
      headers: this.headers
    });
});
