'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module health
  * @extends Vaulted
  * @desc Provides implementation for the Vault Health APIs
  *
 */

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * @method checkHealth
 * @desc Gets the health of the vault
 *
 * @param {Object} options - object of options to send to API request
 * @param {boolean} options.standbyok - true to indicate a standby is acceptable
 * @resolve {Status} Resolves with the current status/health of Vault
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.checkHealth = Promise.method(function checkHealth(options) {
  options = options || {};
  if (_.isBoolean(options.standbyok) && !options.standbyok) {
    delete options.standbyok;
  }
  return this.api.getEndpoint('sys/health')
    .get({
      qs: options
    });
});
