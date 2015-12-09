var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

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
 * Creates a token to use for authenticating with the Vault.
 *
 * @param  {Object} options Hash of options to send to API request.
 *                          The available options (body):
 *                            - id {String}
 *                            - policies {Array}
 *                            - meta {Object<String>}
 *                            - no_parent {Boolean}
 *                            - ttl {String} ex: '1h'
 *                            - display_name {String}
 *                            - num_uses {Number}
 * @return {Promise<Object>} Promise which is resolved with a new auth token.
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
 * Renew an existing token to use for authenticating with the Vault.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 *                          The available options (body):
 *                            - increment {Number}
 * @return {Promise<Object>} Promise which is resolved with a renewed auth token.
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
 * Retrieve information about the specified existing token.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise<Object>} Promise which is resolved with auth token information.
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
 * Revokes the specified existing token and all child tokens.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
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
 * Revokes the specified existing token but not the child tokens.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
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
 * Revokes all tokens generated at a given prefix including children and secrets.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
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
 * Retrieve information about the current client token.
 *
 * @return {Promise<Object>} Promise which is resolved with auth token information.
 */
Vaulted.lookupTokenSelf = Promise.method(function lookupTokenSelf() {
  return this.getTokenLookupSelfEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * Revokes the current client token and all child tokens.
 *
 * @return {Promise}
 */
Vaulted.revokeTokenSelf = Promise.method(function revokeTokenSelf() {
  return this.getTokenRevokeSelfEndpoint()
    .post({
      headers: this.headers
    });
});
