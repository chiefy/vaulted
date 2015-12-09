var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getAppidMapAppEndpoint = _.partial(Proto.validateEndpoint, 'auth/app-id/map/app-id/:id');
  Vaulted.getAppidMapUserEndpoint = _.partial(Proto.validateEndpoint, 'auth/app-id/map/user-id/:id');
  Vaulted.getAppidLoginEndpoint = _.partial(Proto.validateEndpoint, 'auth/app-id/login');
  _.extend(Proto, Vaulted);
};

/**
 * Retrieve the specified app using the app id.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" required.
 * @return {Promise<Object>} Promise which is resolved with the app details.
 */
Vaulted.getApp = Promise.method(function getApp(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide app id.'));
  }

  return this.getAppidMapAppEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
});

/**
 * Creates the specified app in the app-id auth backend of the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise} Promise
 */
Vaulted.createApp = Promise.method(function createApp(options) {
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

  return this.getAppidMapAppEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * Deletes the specified app from the app-id auth backend of the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" required.
 * @return {Promise} Promise
 */
Vaulted.deleteApp = Promise.method(function deleteApp(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide app id.'));
  }

  return this.getAppidMapAppEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * Retrieve the specified user using the user id.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" required.
 * @return {Promise<Object>} Promise which is resolved with user details.
 */
Vaulted.getUser = Promise.method(function getUser(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide user id.'));
  }

  return this.getAppidMapUserEndpoint()
    .get({
      headers: this.headers,
      id: options.id
    });
});

/**
 * Creates the specified user in the app-id auth backend of the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise} Promise
 */
Vaulted.createUser = Promise.method(function createUser(options) {
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

  return this.getAppidMapUserEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * Deletes the specified user from the app-id auth backend of the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" required.
 * @return {Promise} Promise
 */
Vaulted.deleteUser = Promise.method(function deleteUser(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide user id.'));
  }

  return this.getAppidMapUserEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * Authenticates the user of the app using the app-id authentication backend.
 *
 * @param  {Object} options Hash of options to send to API request, key "body" required.
 * @return {Promise<Object>} Promise which is resolved with authentication details including client token.
 */
Vaulted.appLogin = Promise.method(function appLogin(options) {
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

  return this.getAppidLoginEndpoint()
    .post({
      headers: this.headers,
      body: options.body
    });

});
