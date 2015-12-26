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
  Vaulted.getAppidMapAppEndpoint = _.partial(Proto.validateEndpoint, 'auth/%s/map/app-id/:id');
  Vaulted.getAppidMapUserEndpoint = _.partial(Proto.validateEndpoint, 'auth/%s/map/user-id/:id');
  Vaulted.getAppidLoginEndpoint = _.partial(Proto.validateEndpoint, 'auth/%s/login');
  _.extend(Proto, Vaulted);
};

/**
 * @method getApp
 * @desc Retrieve the specified app using the app id.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the app
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {App} Resolves with the app details
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getApp = Promise.method(function getApp(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide app id.'));
  }

  return this.getAppidMapAppEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id
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
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createApp = Promise.method(function createApp(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide app id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide app details.'));
  }
  if (_.isUndefined(options.body.value) || !options.body.value) {
    return Promise.reject(new Error('You must provide app policy id.'));
  }
  if (_.isUndefined(options.body.display_name) || !options.body.display_name) {
    return Promise.reject(new Error('You must provide app display name.'));
  }

  return this.getAppidMapAppEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method deleteApp
 * @desc Deletes the specified app from the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the app
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteApp = Promise.method(function deleteApp(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide app id.'));
  }

  return this.getAppidMapAppEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method getUser
 * @desc Retrieve the specified user using the user id.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the user
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {User} Resolves with the user details
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getUser = Promise.method(function getUser(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide user id.'));
  }

  return this.getAppidMapUserEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id
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
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createUser = Promise.method(function createUser(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide user id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide user details.'));
  }
  if (_.isUndefined(options.body.value) || !options.body.value) {
    return Promise.reject(new Error('You must provide the user app id.'));
  }

  return this.getAppidMapUserEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method deleteUser
 * @desc Deletes the specified user from the app-id auth backend of the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the user
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteUser = Promise.method(function deleteUser(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide user id.'));
  }

  return this.getAppidMapUserEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method appLogin
 * @desc Authenticates the user of the app using the app-id authentication backend.
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.app_id - the app id
 * @param {string} options.body.user_id - the user id
 * @param {string} [mountName=app-id] - path name the app-id auth backend is mounted on
 * @resolve {Auth} Resolves with authentication details including client token.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.appLogin = Promise.method(function appLogin(options, mountName) {
  mountName = mountName || 'app-id';
  options = options || {};
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide user details.'));
  }
  if (_.isUndefined(options.body.app_id) || !options.body.app_id) {
    return Promise.reject(new Error('You must provide app id.'));
  }
  if (_.isUndefined(options.body.user_id) || !options.body.user_id) {
    return Promise.reject(new Error('You must provide user id.'));
  }

  return this.getAppidLoginEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });

});
