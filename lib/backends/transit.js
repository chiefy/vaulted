'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
 * @module backend/transit
 * @extends Vaulted
 * @desc Provides implementation for the Vault Transit APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getTransitKeysEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/keys/:id'), 'transit');
  Vaulted.getTransitKeysConfigEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/keys/:id/config'), 'transit');
  Vaulted.getTransitKeysRotateEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/keys/:id/rotate'), 'transit');
  Vaulted.getTransitEncryptEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/encrypt/:id'), 'transit');
  Vaulted.getTransitDecryptEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/decrypt/:id'), 'transit');
  Vaulted.getTransitRewrapEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/rewrap/:id'), 'transit');
  Vaulted.getTransitPlainTextDatakeyEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/datakey/plaintext/:id'), 'transit');
  Vaulted.getTransitWrappedDatakeyEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/datakey/wrapped/:id'), 'transit');
  _.extend(Proto, Vaulted);
};

/**
 * @method setTransitKey
 * @desc Creates a new named encryption key. The values set here cannot be changed after key creation.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {boolean} [options.body.derived] - Boolean flag indicating if key derivation MUST be used.
 * @param {boolean} [options.body.convergent_encryption] - If set, the key will support convergent
 * encryption, where the same plaintext creates the same ciphertext.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setTransitKey = Promise.method(function setTransitKey(options, mountName) {
  options = utils.setDefaults(options, {
    derived: false,
    convergent_encryption: false
  });

  if (options.body.convergent_encryption && !options.body.derived) {
    return Promise.reject(new Error('Convergent encryption requires key derivation to be set'));
  }

  return this.getTransitKeysEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _token: options.token
    });
});

/**
 * @method getTransitKey
 * @desc Returns information about a named encryption key.
 * The keys object shows the creation time of each key version; the values
 * are not the keys themselves.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with information about the encryption key
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getTransitKey = Promise.method(function getTransitKey(options, mountName) {
  options = options || {};

  return this.getTransitKeysEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method deleteTransitKey
 * @desc Deletes a named encryption key. It will no longer be possible to decrypt
 * any data encrypted with the named key. Because this is a potentially catastrophic
 * operation, the deletion_allowed tunable must be set in the key's /config endpoint
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteTransitKey = Promise.method(function deleteTransitKey(options, mountName) {
  options = options || {};

  return this.getTransitKeysEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method setTransitKeyConfig
 * @desc Allows tuning configuration values for a given key. (These values are returned
 * during a read operation on the named key.)
 *
 * @param {string} options.id - unique identifier for the key
 * @param {number} [options.body.min_decryption_version] - The minimum version of ciphertext allowed to be decrypted.
 * @param {boolean} [options.body.deletion_allowed] - When set, the key is allowed to be deleted.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setTransitKeyConfig = Promise.method(function setTransitKeyConfig(options, mountName) {
  options = utils.setDefaults(options, {
    min_decryption_version: 0,
    deletion_allowed: false
  });

  return this.getTransitKeysConfigEndpoint(mountName)
    .post({
      body: options.body,
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method rotateTransitKey
 * @desc Rotates the version of the named key. After rotation, new plaintext requests will
 * be encrypted with the new version of the key. To upgrade ciphertext to be encrypted
 * with the latest version of the key, use the rewrap endpoint.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.rotateTransitKey = Promise.method(function rotateTransitKey(options, mountName) {
  options = options || {};

  return this.getTransitKeysRotateEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method encryptTransitPlainText
 * @desc Encrypts the provided plaintext using the named key. This path supports the create and
 * update policy capabilities as follows: if the user has the create capability for this endpoint
 * in their policies, and the key does not exist, it will be upserted with default values
 * (whether the key requires derivation depends on whether the context parameter is empty or
 * not). If the user only has update capability and the key does not exist, an error will be returned.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} options.body.plaintext - The plaintext to encrypt, provided as base64 encoded
 * @param {string} [options.body.context] - The key derivation context, provided as base64 encoded.
 * Must be provided if derivation is enabled.
 * @param {string} [options.body.nonce] - The nonce value, provided as base64 encoded. Must be
 * provided if convergent encryption is enabled for this key.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with the encrypted ciphertext output
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.encryptTransitPlainText = Promise.method(function encryptTransitPlainText(options, mountName) {
  options = options || {};

  return this.getTransitEncryptEndpoint(mountName)
  .post({
    body: options.body,
    headers: this.headers,
    id: options.id,
    _token: options.token
  });
});

/**
 * @method decryptTransitCipherText
 * @desc Decrypts the provided ciphertext using the named key.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} options.body.ciphertext - The ciphertext to decrypt, provided as returned by encrypt.
 * @param {string} [options.body.context] - The key derivation context, provided as base64 encoded.
 * Must be provided if derivation is enabled.
 * @param {string} [options.body.nonce] - The nonce value, provided as base64 encoded. Must be
 * provided if convergent encryption is enabled for this key.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with the decrypted plaintext output
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.decryptTransitCipherText = Promise.method(function decryptTransitCipherText(options, mountName) {
  options = options || {};

  return this.getTransitDecryptEndpoint(mountName)
    .post({
      body: options.body,
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method rewrapTransitCipherText
 * @desc Rewrap the provided ciphertext using the latest version of the named key.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} options.body.ciphertext - The ciphertext to decrypt, provided as returned by encrypt.
 * @param {string} [options.body.context] - The key derivation context, provided as base64 encoded.
 * Must be provided if derivation is enabled.
 * @param {string} [options.body.nonce] - The nonce value, provided as base64 encoded. Must be
 * provided if convergent encryption is enabled for this key.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with the decrypted plaintext output
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.rewrapTransitCipherText = Promise.method(function rewrapTransitCipherText(options, mountName) {
  options = options || {};

  return this.getTransitRewrapEndpoint(mountName)
    .post({
      body: options.body,
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method generateTransitPlainTextDataKey
 * @desc Generate a new high-entropy key, the value encrypted with the named key, and the plaintext of the key.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} [options.body.context] - The key derivation context, provided as base64 encoded.
 * Must be provided if derivation is enabled.
 * @param {string} [options.body.nonce] - The nonce value, provided as base64 encoded. Must be provided
 * if convergent encryption is enabled for this key.
 * @param {number} [option.body.bits] - The number of bits in the desired key. Can be 128, 256, or 512.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with a new key and the value encrypted with the named key.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.generateTransitPlainTextDataKey = Promise.method(function generateTransitPlainTextDataKey (options, mountName) {
  options = utils.setDefaults(options, {
    bits: 256
  });

  return this.getTransitPlainTextDatakeyEndpoint(mountName)
    .post({
      body: options.body,
      headers: this.headers,
      format: options.format,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method generateTransitWrappedDataKey
 * @desc Generate a new high-entropy key and the value encrypted with the named key.
 *
 * @param {string} options.id - unique identifier for the key
 * @param {string} [options.body.context] - The key derivation context, provided as base64 encoded.
 * Must be provided if derivation is enabled.
 * @param {string} [options.body.nonce] - The nonce value, provided as base64 encoded. Must be provided
 * if convergent encryption is enabled for this key.
 * @param {number} [option.body.bits] - The number of bits in the desired key. Can be 128, 256, or 512.
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=transit] - path name the transit secret backend is mounted on
 * @resolve {object} Resolves with a new key and, optionally, the value encrypted with the named key.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.generateTransitWrappedDataKey = Promise.method(function generateTransitWrappedDataKey(options, mountName) {
  options = utils.setDefaults(options, {
    bits: 256
  });

  return this.getTransitWrappedDatakeyEndpoint(mountName)
    .post({
      body: options.body,
      headers: this.headers,
      format: options.format,
      id: options.id,
      _token: options.token
    });
});
