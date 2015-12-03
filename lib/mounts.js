var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id');
  Vaulted.getRemountEndpoint = _.partial(Proto.validateEndpoint, 'sys/remount');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the list of mounts for the vault and sets internal property accordingly
 *
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'mounts' property updated.
 */
Vaulted.getMounts = Promise.method(function getMounts() {
  return this.getMountsEndpoint()
    .get({
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function gotMounts(mounts) {
      this.mounts = mounts;
      return this.mounts;
    });
});

/**
 * Deletes the specified mount from the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'mounts' property updated.
 */
Vaulted.deleteMount = Promise.method(function deleteMount(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide mount id.'));
  }

  return this.getMountsEndpoint()
    .delete({
      id: options.id,
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(this.getMounts);
});

/**
 * Creates the specified mount in the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'mounts' property updated.
 */
Vaulted.createMount = Promise.method(function createMount(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide mount id.'));
  }

  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide mount details.'));
  }

  if (_.isUndefined(options.body.type) || !options.body.type) {
    return Promise.reject(new Error('You must provide mount type.'));
  }

  return this.getMountsEndpoint()
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
    .then(this.getMounts);
});

/**
 * Renames the specified mount to a new name in the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, keys "from" and "to" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted with 'mounts' property updated.
 */
Vaulted.reMount = Promise.method(function reMount(options) {
  options = options || {};
  if(_.isUndefined(options.from) || !options.from) {
    return Promise.reject(new Error('You must provide from mount.'));
  }

  if(_.isUndefined(options.to) || !options.to) {
    return Promise.reject(new Error('You must provide to mount.'));
  }

  // make sure the mount exists but the user could pass in the mount
  // id with or without the forward slash and if we are unable to
  // find it using either variation then reject the request.
  if(_.isUndefined(this.mounts[options.from]) && _.isUndefined(
    this.mounts[options.from + '/'])) {
    return Promise.reject(
      new Error('Could not find existing mount named: ' + options.from));
  }

  return this.getRemountEndpoint()
    .post({
      headers: this.headers,
      body: options
    })
    .promise()
    .bind(this)
    .then(this.getMounts);
});
