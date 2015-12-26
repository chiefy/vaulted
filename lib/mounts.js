var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module mounts
  * @extends Vaulted
  * @desc Provides implementation for the Vault Secret Backend Mounts APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id');
  Vaulted.getRemountEndpoint = _.partial(Proto.validateEndpoint, 'sys/remount');
  _.extend(Proto, Vaulted);
};

/**
 * @method getMounts
 * @desc Gets the list of mounts for the vault and sets internal property accordingly
 *
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
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
 * @method deleteMount
 * @desc Deletes the specified mount from the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret backend mount
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
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
    .then(function () {
      this.emit('unmount', options.id);
      return this.getMounts();
    });
});

/**
 * @method createMount
 * @desc Creates the specified mount in the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the secret backend mount
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.type - the type of secret backend ('consul')
 * @param {string} [options.body.description] - a description of the secret backend for operators.
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
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
    .then(function () {
      this.emit('mount', options.body.type, options.id);
      return this.getMounts();
    });
});

/**
 * @method reMount
 * @desc Renames the specified mount to a new name in the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.from - current unique identifier for the secret backend mount
 * @param {string} options.to - new unique identifier for the secret backend mount
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
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
  var mount = this.mounts[options.from] || this.mounts[options.from + '/'];
  if(_.isUndefined(mount)) {
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
    .then(function () {
      this.emit('unmount', options.from);
      this.emit('mount', mount.type, options.to);
      return this.getMounts();
    });
});
