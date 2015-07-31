var
  _ = require('lodash');

module.exports = config;

function config(config_obj) {
  config_obj = _.isObject(config_obj) ? config_obj : {};

  var convict, conf;

  convict = require('convict');

  conf = convict({
    env: {
      doc: 'Application environment',
      format: ['prod', 'stage', 'dev', 'test'],
      default: 'dev',
      env: 'NODE_ENV'
    },
    prefix: {
      doc: 'API prefix / version',
      format: String,
      default: 'v1',
      env: 'API_VERSION'
    },
    vault_url: {
      doc: 'Vault server url',
      format: String,
      default: 'http://127.0.0.1:8200',
      env: 'VAULT_URL'
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
        'config/api_auth_token.json',
        'config/api_secret.json'
      ]
    }
  });

  conf.load(config_obj);

  conf.validate();

  conf.set('vault_url', conf.get('vault_url') + '/' + conf.get('prefix'));

  return conf;
}