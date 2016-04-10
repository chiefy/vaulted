'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
 * @module auth/github
 * @extends Vaulted
 * @desc Provides implementation for the Vault Auth Github backend APIs
 */

module.exports = function extend(Proto) {
  Vaulted.getGithubLoginEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/login'), 'github');
  _.extend(Proto, Vaulted);
};


/**
 * @method githubLogin
 * @desc Authenticates the user with Github authentication backend.
 *
 * @param {string} options.body.token - github token
 * @param {string} [options.token] - the authentication token
 * @resolve {Auth} Resolves with authentication details including client token.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.githubLogin = Promise.method(function githubLogin(options, mountName) {
  options = options || {};

  return this.getGithubLoginEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body,
      _token: options.token
    });
});

