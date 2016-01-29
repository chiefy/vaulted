'use strict';
var
  _ = require('lodash'),
  Config = require('confab-addons');

var ALL_OPTIONS = [
  'debug',
  'vault_host',
  'vault_port',
  'vault_ssl',
  'vault_token',
  'ssl_ciphers',
  'ssl_cert_file',
  'ssl_pem_file',
  'ssl_pem_passphrase',
  'ssl_ca_cert',
  'ssl_verify',
  'proxy_address',
  'proxy_port',
  'proxy_username',
  'proxy_password',
  'timeout',
  'secret_shares',
  'secret_threshold'
];

var DEFAULTS = {
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: true,
  ssl_ciphers: 'TLSv1.2',
  ssl_verify: true,
  secret_shares: 3,
  secret_threshold: 2
};

/**
 * @module config
 * @desc Provides the management of configurations.
 * @private
 */

module.exports = function validate(options) {
  options = options || {};

  var invalids = [];
  var check = _.partial(_.includes, ALL_OPTIONS);
  _.forEach(_.keys(options), function (n) {
    if (!check(n)) {
      invalids.push(n);
    }
  });

  if (!_.isEmpty(invalids)) {
    throw new Error('Unsupported option provided: ' + invalids);
  }
  return Config.create([
    Config.loadEnvConfigFile(),
    Config.loadEnvironment({
      DEBUG: 'debug',
      VAULT_HOST: 'vault_host',
      VAULT_PORT: 'vault_port',
      VAULT_SSL: 'vault_ssl',
      VAULT_TOKEN: 'vault_token',
      VAULT_SSL_CIPHERS: 'ssl_ciphers',
      VAULT_SSL_CERT: 'ssl_cert_file',
      VAULT_SSL_CERT_KEY: 'ssl_pem_file',
      VAULT_SSL_CERT_PASSPHRASE: 'ssl_pem_passphrase',
      VAULT_CACERT: 'ssl_ca_cert',
      VAULT_SSL_VERIFY: 'ssl_verify',
      VAULT_PROXY_ADDRESS: 'proxy_address',
      VAULT_PROXY_PORT: 'proxy_port',
      VAULT_PROXY_USERNAME: 'proxy_username',
      VAULT_PROXY_PASSWORD: 'proxy_password',
      VAULT_TIMEOUT: 'timeout',
      SECRET_SHARES: 'secret_shares',
      SECRET_THRESHOLD: 'secret_threshold'
    }, {
      resolveBooleans: true
    }),
    Config.assign(options),
    Config.defaults(DEFAULTS)
  ]);
};
