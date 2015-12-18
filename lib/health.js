var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * Gets the health of the vault
 *
 * @return {Promise<Object>} Promise which is resolved with the vault health.
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
