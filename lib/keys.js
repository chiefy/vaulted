var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  internal = require('./internal');

module.exports = function extend(Proto) {
  Vaulted.getKeyStatusEndpoint = _.partial(Proto.validateEndpoint, 'sys/key-status');
  Vaulted.getKeyRotateEndpoint = _.partial(Proto.validateEndpoint, 'sys/rotate');
  Vaulted.getRekeyInitEndpoint = _.partial(Proto.validateEndpoint, 'sys/rekey/init');
  Vaulted.getRekeyUpdateEndpoint = _.partial(Proto.validateEndpoint, 'sys/rekey/update');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the status of the current key
 *
 * @return {Promise<Object>} Promise which is resolved with the vault key status.
 */
Vaulted.getKeyStatus = Promise.method(function getKeyStatus() {
  return this.getKeyStatusEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * Initiate the rotation of the encryption key for data stored in the vault
 *
 * @return {Promise} Promise
 */
Vaulted.rotateKey = Promise.method(function rotateKey() {
  return this.getKeyRotateEndpoint()
    .put({
      headers: this.headers
    });
});

/**
 * Gets the status of the rekey process.
 *
 * @return {Promise<Object>} Promise which is resolved with the vault rekey status.
 */
Vaulted.getRekeyStatus = Promise.method(function getRekeyStatus() {
  return this.getRekeyInitEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * Start the rekey process.
 *
 * @param  {Object}   options   Overrides sent to API command, 'secret_shares' and 'secret_threshold', both {Number}
 * @return {Promise}  Promise
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
 * Stops/Cancels the current rekey process.
 *
 * @return {Promise} Promise
 */
Vaulted.stopRekey = Promise.method(function stopRekey() {
  return this.getRekeyInitEndpoint()
    .delete({
      headers: this.headers
    });
});

/**
 * Sends the next key share to continue the rekey process.
 *
 * @return {Promise<Vaulted>} Promise is resolved with bound instance.
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
