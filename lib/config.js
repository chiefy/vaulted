var
  _ = require('lodash'),
  convict = require('convict'),
  os = require('os'),
  path = require('path');

module.exports = config;

function config(config_obj) {
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
    prefix: {
      doc: 'API prefix / version',
      format: String,
      default: 'v1',
      env: 'API_VERSION'
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
    api_def_files: {
      doc: 'API definition JSON files',
      format: Array,
      default: [
        'config/api_sys.json',
        'config/api_aws.json',
        'config/api_consul.json',
        'config/api_auth_token.json',
        'config/api_secret.json'
      ]
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
  vault_url += '/' + conf.get('prefix');

  conf.set('vault_url', vault_url);

  return conf;
}

