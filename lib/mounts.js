var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('./utils');

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
 * @param {Object} [options] - object of options to send to API request
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
      return this.getMounts();
    });
});

/**
 * @method mountConsul
 * @desc Convenience method to enable the `consul` secret backend for use with the vault.
 *
 * @param {Object} [options] - object of options to send to API request
 * @param {string} [options.id=consul] - unique identifier for the secret backend mount
 * @param {Object} [options.body] - holds the attributes passed as inputs
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
 * @param {Object} [options] - object of options to send to API request
 * @param {string} [options.id=pki] - unique identifier for the secret backend mount
 * @param {Object} [options.body] - holds the attributes passed as inputs
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
