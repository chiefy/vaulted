'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module init
  * @extends Vaulted
  * @desc Provides implementation for the Vault Initialization APIs
  *
 */

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * @method init
 * @desc Initializes a remote vault
 *
 * @param {Object} options - object of options to send to API request
 * @param {number} [options.secret_shares=config['secret_shares']] - number of shares to split the master key into
 * @param {number} [options.secret_threshold=config['secret_threshold']] - number of shares required to reconstruct the master key
 * @resolve {Vaulted} Resolves with keys and token or current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.init = Promise.method(function init(options) {
  if (this.initialized === true) {
    return Promise.resolve(this);
  }

  options = _.defaults(options || {}, {
    secret_shares: this.config.get('secret_shares'),
    secret_threshold: this.config.get('secret_threshold')
  });

  return this.api.getEndpoint('sys/init')
    .put({
      body: options
    });
});

/**
 * @method getInitStatus
 * @desc Gets the initialize status of a vault
 *
 * @resolve {Status} Resolves with the vault initializtion status
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getInitStatus = Promise.method(function getInitStatus() {
  return this.api.getEndpoint('sys/init')
    .get();
});
