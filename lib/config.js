var
  _ = require('lodash'),
  convict = require('convict'),
  os = require('os'),
  path = require('path');

/**
  * @module config
  * @desc Provides the management of configurations.
  *
 */

/** Process the configurations using inputs and environment variables. */
module.exports = function config(config_obj) {
  config_obj = _.isObject(config_obj) ? config_obj : {};
  var
    conf,
    vault_url;

  conf = convict({
    env: {
      doc: 'Application environment',
      format: ['prod', 'stage', 'dev', 'test'],
      default: 'dev',
      env: 'NODE_ENV'
    },
    debug: {
      doc: 'Show verbose messages, network requests',
      format: 'int',
      default: 0,
      env: 'VAULTED_DEBUG'
    },
    vault_host: {
      doc: 'Vault server hostname',
      format: String,
      default: '127.0.0.1',
      env: 'VAULT_HOST'
    },
    vault_port: {
      doc: 'Vault server port',
      format: 'int',
      default: 8200,
      env: 'VAULT_PORT'
    },
    vault_ssl: {
      doc: 'Use SSL?',
      format: 'int',
      default: 1,
      env: 'VAULT_SSL'
    },
    vault_token: {
      doc: 'Token to use to access the vault',
      format: String,
      env: 'VAULT_TOKEN'
    },
    ssl_ciphers: {
      doc: 'The ciphers that will be used when communicating with vault over ssl',
      format: String,
      default: 'TLSv1.2',
      env: 'VAULT_SSL_CIPHERS'
    },
    ssl_cert_file: {
      doc: 'Path to custom SSL cert file',
      format: String,
      env: 'VAULT_SSL_CERT'
    },
    ssl_pem_file: {
      doc: 'Path of SSL cert PEM file to use with custom SSL verification',
      format: String,
      env: 'VAULT_SSL_CERT_KEY'
    },
    ssl_pem_passphrase: {
      doc: 'Passphrase associated SSL cert PEM file to use with custom SSL verification',
      format: String,
      env: 'VAULT_SSL_CERT_PASSPHRASE'
    },
    ssl_ca_cert: {
      doc: 'Path of CA cert to use for certification verification',
      format: String,
      env: 'VAULT_CACERT'
    },
    ssl_verify: {
      doc: 'Flag to indicate whether to validate SSL requests',
      format: Boolean,
      default: true,
      env: 'VAULT_SSL_VERIFY'
    },
    proxy_address: {
      doc: 'The HTTP Proxy server address',
      format: String,
      env: 'VAULT_PROXY_ADDRESS'
    },
    proxy_port: {
      doc: 'The HTTP Proxy server port',
      format: String,
      env: 'VAULT_PROXY_PORT'
    },
    proxy_username: {
      doc: 'The HTTP Proxy server username',
      format: String,
      env: 'VAULT_PROXY_USERNAME'
    },
    proxy_password: {
      doc: 'The HTTP Proxy user password',
      format: String,
      env: 'VAULT_PROXY_PASSWORD'
    },
    timeout: {
      doc: 'Number of milliseconds to wait for a server to send response headers',
      format: 'int',
      env: 'VAULT_TIMEOUT'
    },
    secret_shares: {
      doc: 'Number of shared secret keys to generate',
      format: 'int',
      default: 3,
      env: 'SECRET_SHARES'
    },
    secret_threshold: {
      doc: 'Threshold at which to unseal vault (must be <= SECRET_SHARES)',
      format: 'int',
      default: 2,
      env: 'SECRET_THRESHOLD'
    },
    backup_dir: {
      doc: 'Directory to backup keys',
      format: String,
      default: path.join(os.homedir(), '.vault'),
      env: 'VAULT_SAFE'
    }
  });

  conf.load(config_obj);

  conf.validate();

  vault_url = 'http';
  vault_url += (conf.get('vault_ssl') === 1 ? 's' : '');
  vault_url += '://' + conf.get('vault_host');
  vault_url += ':' + conf.get('vault_port');

  conf.set('vault_url', vault_url);

  return conf;
};
