// a bit of a hack but it seems that NPM does not seem to install
// the provided configurations in the application root.
if (!require('./utils').configured()) {
  process.env.NODE_CONFIG_DIR = __dirname + '/../config';
}
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
  'secret_threshold',
  'backup_dir',
  'no_global_token'
];

/**
 * @module config
 * @desc Provides the management of configurations.
 *
 */

/** Process the configurations using inputs and environment variables. */

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
  return config.util.extendDeep(config, options);
};
