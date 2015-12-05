var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getAuthEndpoint = _.partial(Proto.validateEndpoint, 'sys/auth/:id');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the list of authentication backend mounts for the vault and sets internal property accordingly
 *
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'auths' property updated.
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
 * Deletes the specified authentication backend mount from the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'auths' property updated.
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
 * Creates the specified authentication backend mount in the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'auths' property updated.
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
