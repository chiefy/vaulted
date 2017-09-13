'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
 * @module mounts
 * @extends Vaulted
 * @desc Provides implementation for the Vault Secret Backend Mounts APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getTuneMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id/tune');
  Vaulted.getMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id');
  Vaulted.getRemountEndpoint = _.partial(Proto.validateEndpoint, 'sys/remount');
  _.extend(Proto, Vaulted);
};

/**
 * @method getMounts
 * @desc Gets the list of mounts for the vault and sets internal property accordingly
 *
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getMounts = Promise.method(function getMounts(options) {
  options = utils.setDefaults(options);

  return this.getMountsEndpoint()
    .get({
      headers: this.headers,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function gotMounts(mounts) {
      this.mounts = mounts.data;
      return this.mounts;
    });
});

/**
 * @method deleteMount
 * @desc Deletes the specified mount from the vault and sets internal property accordingly
 *
 * @param {string} options.id - unique identifier for the secret backend mount
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteMount = Promise.method(function deleteMount(options) {
  options = utils.setDefaults(options);
  return this.getMountsEndpoint()
    .delete({
      id: options.id,
      headers: this.headers,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function () {
      this.emit('unmount', options.id);
      return this.getMounts({token: options.token});
    });
});

/**
 * @method createMount
 * @desc Creates the specified mount in the vault and sets internal property accordingly
 *
 * @param {string} options.id - unique identifier for the secret backend mount
 * @param {string} options.body.type - the type of secret backend ('consul', 'pki')
 * @param {string} [options.body.description] - a description of the secret backend for operators.
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createMount = Promise.method(function createMount(options) {
  options = utils.setDefaults(options);
  return this.getMountsEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function () {
      this.emit('mount', options.body.type, options.id);
      return this.getMounts({token: options.token});
    });
});

/**
 * @method tuneMount
 * @desc Tunes the TTL config of an existing mount
 * @param {string} options.id - unique identifier for the secret backend mount
 * @param {string} [options.body.default_lease_ttl] the default lease TTL as a string
 * @param {string} [options.body.max_lease_ttl] - the maximum value to set a ttl as a string
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mount]} Resolves with current mount with newly set TTL config
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.tuneMount = Promise.method(function tuneMount(options) {
  options = utils.setDefaults(options);
  return this.getTuneMountsEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(_.partial(this.getMounts, {token: options.token}))
    .then(function (mounts) {
      if(!mounts || !mounts[options.id + '/']) {
        return Promise.reject('Could not get mount id: ' + options.id);
      }
      return mounts[options.id + '/'];
    });
});

/**
 * @method getMountTune
 * @desc Gets the current TTL config for a mount
 * @param {string} options.id - unique identifier for the secret backend mount
 * @param {string} [options.token] - the authentication token
 * @resolve {Object} Resolves with an object representing the current TTL settings for mount
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getMountTune = Promise.method(function getMountTune(options) {
  options = utils.setDefaults(options);
  return this.getTuneMountsEndpoint()
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method reMount
 * @desc Renames the specified mount to a new name in the vault and sets internal property accordingly
 *
 * @param {string} options.from - current unique identifier for the secret backend mount
 * @param {string} options.to - new unique identifier for the secret backend mount
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.reMount = Promise.method(function reMount(options) {
  options = utils.setDefaults(options);
  var mount = this.mounts[options.from] || this.mounts[options.from + '/'];

  return this.getRemountEndpoint()
    .post({
      headers: this.headers,
      body: options,
      _token: options.token
    })
    .promise()
    .bind(this)
    .then(function () {
      this.emit('unmount', options.from);
      this.emit('mount', mount.type, options.to);
      return this.getMounts({token: options.token});
    });
});

/**
 * @method mountConsul
 * @desc Convenience method to enable the `consul` secret backend for use with the vault.
 *
 * @param {string} [options.id=consul] - unique identifier for the secret backend mount
 * @param {string} [options.body.description] - a description of the secret backend for operators.
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.mountConsul = Promise.method(function mountConsul(options) {
  options = utils.setDefaults(options);
  options.id = options.id || 'consul';
  options.body = _.defaults(options.body, {
    type: 'consul',
    description: 'Consul Secrets Backend ' + options.id
  });

  return this.createMount({
    id: options.id,
    body: options.body,
    token: options.token
  });
});

/**
 * @method mountPki
 * @desc Convenience method to enable the `pki` secret backend for use with the vault.
 *
 * @param {string} [options.id=pki] - unique identifier for the secret backend mount
 * @param {string} [options.body.description] - a description of the secret backend for operators.
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted secret backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.mountPki = Promise.method(function mountPki(options) {
  options = utils.setDefaults(options);
  options.id = options.id || 'pki';
  options.body = _.defaults(options.body, {
    type: 'pki',
    description: 'PKI Secrets Backend ' + options.id
  });

  return this.createMount({
    id: options.id,
    body: options.body,
    token: options.token
  });
});

/**
* @method mountTransit
* @desc Convenience method to enable the `transit` secret backend for use with the vault.
*
* @param {string} [options.id=transit] - unique identifier for the secret backend mount
* @param {string} [options.body.description] - a description of the secret backend for operators.
* @param {string} [options.token] - the authentication token
* @resolve {[Mounts]} Resolves with current list of mounted secret backends
* @reject {Error} An error indicating what went wrong
* @return {Promise}
*/
Vaulted.mountTransit = Promise.method(function mountTransit(options) {
  options = utils.setDefaults(options);
  options.id = options.id || 'transit';
  options.body = _.defaults(options.body, {
    type: 'transit',
    description: 'Transit Secrets Backend ' + options.id
  });

  return this.createMount({
    id: options.id,
    body: options.body,
    token: options.token
  });
});
