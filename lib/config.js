var
  _ = require('lodash'),
  convict = require('convict');

module.exports = config;

function config(config_obj) {
  config_obj = _.isObject(config_obj) ? config_obj : {};

  var convict, conf, env;

  convict = require('convict');

  conf = convict({
    env: {
      doc: 'Application environment',
      format: ['prod', 'stage', 'dev', 'test'],
      default: 'dev',
      env: "NODE_ENV"
    },
    prefix: {
      doc: "API prefix / version",
      format: String,
      default: "v1",
      env: "API_VERSION"
    },
    addr: {
      doc: "Vault server URI",
      format: "url",
      default: "http://127.0.0.1:8200",
      env: "VAULT_ADDR"
    },
    api_def: {
      doc: "API definition JSON file",
      format: String,
      default: "config/api_sys.json"
    }
  });

  conf.load(config_obj);

  conf.validate();

  return conf;
}


