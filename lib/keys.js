var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  internal = require('./internal');

/**
  * @module keys
  * @extends Vaulted
  * @desc Provides implementation for the Vault Key Rotation APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getKeyStatusEndpoint = _.partial(Proto.validateEndpoint, 'sys/key-status');
  Vaulted.getKeyRotateEndpoint = _.partial(Proto.validateEndpoint, 'sys/rotate');
  Vaulted.getRekeyInitEndpoint = _.partial(Proto.validateEndpoint, 'sys/rekey/init');
  Vaulted.getRekeyUpdateEndpoint = _.partial(Proto.validateEndpoint, 'sys/rekey/update');
  _.extend(Proto, Vaulted);
};

/**
 * @method getKeyStatus
 * @desc Gets the status of the current key
 *
 * @resolve {Status} Resolves with the vault key status.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getKeyStatus = Promise.method(function getKeyStatus() {
  return this.getKeyStatusEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * @method rotateKey
 * @desc Initiate the rotation of the encryption key for data stored in the vault
 *
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.rotateKey = Promise.method(function rotateKey() {
  return this.getKeyRotateEndpoint()
    .put({
      headers: this.headers
    });
});

/**
 * @method getRekeyStatus
 * @desc Gets the status of the rekey process.
 *
 * @resolve {Status} Resolves with the vault rekey status.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getRekeyStatus = Promise.method(function getRekeyStatus() {
  return this.getRekeyInitEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * @method startRekey
 * @desc Start the rekey process.
 *
 * @param {Object} options - object of options to send to API request
 * @param {number} [options.secret_shares=config['secret_shares']] - number of shares to split the master key into
 * @param {number} [options.secret_threshold=config['secret_threshold']] - number of shares required to reconstruct the master key
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.startRekey = Promise.method(function startRekey(options) {

  options = _.defaults(options || {}, {
    secret_shares: this.config.get('secret_shares'),
    secret_threshold: this.config.get('secret_threshold')
  });

  return this.getRekeyInitEndpoint()
    .put({
      headers: this.headers,
      body: options
    });
});

/**
 * @method stopRekey
 * @desc Stops/Cancels the current rekey process.
 *
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.stopRekey = Promise.method(function stopRekey() {
  return this.getRekeyInitEndpoint()
    .delete({
      headers: this.headers
    });
});

/**
 * @method updateRekey
 * @desc Sends the next key share to continue the rekey process.
 *
 * @resolve {Vaulted} Resolves with current instance of Vaulted after capturing the keys and token
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.updateRekey = Promise.method(function updateRekey() {

  return this.getRekeyUpdateEndpoint()
    .put({
      headers: this.headers,
      body: {
        key: _.sample(this.keys)
      }
    })
    .promise()
    .bind(this)
    .then(function rekeyDone(status) {
      if (status.complete) {
        this.setKeys(status.keys);
        return internal.backup(this);
      }
      return this.updateRekey();
    });

});
