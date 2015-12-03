var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  internal = require('./internal');

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * Initializes a remote vault
 *
 * @param  {Object}   options   Overrides sent to API command, 'secret_shares' and 'secret_threshold', both {Number}
 * @return {Promise}  Promise which is resolved with current instance of Vaulted. Populates keys and tokens properties.
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
    })
    .promise()
    .bind(this)
    .then(function keysAndToken(keys_and_token) {
      this.setKeys(keys_and_token.keys);
      this.setToken(keys_and_token.root_token);
      return internal.backup(this);
    });
});

/**
 * Gets the initialize status of a vault
 *
 * @return {Promise<Vaulted>} Promise which is resolved with the vault initializtion status.
 */
Vaulted.getInitStatus = Promise.method(function getInitStatus() {
  return this.api.getEndpoint('sys/init')
    .get();
});
