var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getLeaderEndpoint = _.partial(Proto.validateEndpoint, 'sys/leader');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the leader of a vault
 *
 * @return {Promise<Object>} Promise which is resolved with the vault leader.
 */
Vaulted.getLeader = Promise.method(function getLeader() {
  return this.getLeaderEndpoint()
    .get({
      headers: this.headers
    });
});
