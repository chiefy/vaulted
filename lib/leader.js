var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module leader
  * @extends Vaulted
  * @desc Provides implementation for the Vault Leader APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getLeaderEndpoint = _.partial(Proto.validateEndpoint, 'sys/leader');
  _.extend(Proto, Vaulted);
};

/**
 * @method getInitStatus
 * @desc Gets the leader of a vault
 *
 * @resolve {Leader} Resolves with the vault leader
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getLeader = Promise.method(function getLeader() {
  return this.getLeaderEndpoint()
    .get({
      headers: this.headers
    });
});
