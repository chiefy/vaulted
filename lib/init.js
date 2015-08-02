
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

/**
 * Initializes a remote vault
 *
 * @param  {Object}   options   Overrides sent to API command, 'secret_shares' and 'secret_threshold', both {Number}
 * @return {Promise}  Promise which is resolved with current instance of Vaulted. Populates keys and tokens properties.
 */
Vaulted.init = function init(options) {
  if (this.initialized === true) {
    return Promise.reject(new Error('Vault is already initialized.'));
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
      this.keys = keys_and_token.keys;
      this.initialized = true;
      return this.setToken(keys_and_token.root_token);
    });
};


