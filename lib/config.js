'use strict';
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var
  _ = require('lodash'),
  config = require('config');

/** @constant
    @type {Array}
    @default
*/
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
 *
 */

/** Process the configurations using inputs and environment variables. */

module.exports = function validate(options) {
  options = _.defaults(options || {}, DEFAULTS);

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
  return config.util.extendDeep(config, options);
};
