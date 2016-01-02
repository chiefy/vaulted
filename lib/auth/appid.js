'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
 * @module auth/appid
 * @extends Vaulted
 * @desc Provides implementation for the Vault Auth Appid backend APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getAppidMapAppEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/map/app-id/:id'), 'app-id');
  Vaulted.getAppidMapUserEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/map/user-id/:id'), 'app-id');
  Vaulted.getAppidLoginEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, 'auth/%s/login'), 'app-id');
  _.extend(Proto, Vaulted);
};

/**
 * @method getApp
 * @desc Retrieve the specified app using the app id.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the app
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {App} Resolves with the app details
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getApp = Promise.method(function getApp(options, mountName) {
  options = options || {};

  return this.getAppidMapAppEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method createApp
 * @desc Creates the specified app in the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the app
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.value - the policy id
 * @param {string} options.body.display_name - human-readable name of the app.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createApp = Promise.method(function createApp(options, mountName) {
  options = options || {};

  return this.getAppidMapAppEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method deleteApp
 * @desc Deletes the specified app from the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the app
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteApp = Promise.method(function deleteApp(options, mountName) {
  options = options || {};

  return this.getAppidMapAppEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method getUser
 * @desc Retrieve the specified user using the user id.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the user
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {User} Resolves with the user details
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getUser = Promise.method(function getUser(options, mountName) {
  options = options || {};

  return this.getAppidMapUserEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method createUser
 * @desc Creates the specified user in the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the user
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.value - the app id
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createUser = Promise.method(function createUser(options, mountName) {
  options = options || {};

  return this.getAppidMapUserEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method deleteUser
 * @desc Deletes the specified user from the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the user
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteUser = Promise.method(function deleteUser(options, mountName) {
  options = options || {};

  return this.getAppidMapUserEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method appLogin
 * @desc Authenticates the user of the app using the app-id authentication backend.
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.app_id - the app id
 * @param {string} options.body.user_id - the user id
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {Auth} Resolves with authentication details including client token.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.appLogin = Promise.method(function appLogin(options, mountName) {
  options = options || {};

  return this.getAppidLoginEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body,
      _token: options.token
    });

});
