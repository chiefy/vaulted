var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint = require('./endpoint');

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
      format: 'url',
      default: 'http://127.0.0.1:8200',
      env: 'VAULT_URL'
    },
    api_def_files: {
      doc: 'API definition JSON files',
      format: Array,
      default: ['config/api_sys.json', 'config/api_aws.json', 'config/api_auth_token.json']
    }
  });

  conf.load(config_obj);

  conf.validate();

  conf.set('vault_url', conf.get('vault_url') + '/' + conf.get('prefix'));

  return loadAPIDefinitions(conf);
}

function readConfigFromPath(config, api, path) {
  var
    prefix = config.get('prefix'),
    api_type,
    parsed_api;

  path =  __dirname + '/../' + path;

  try {
    api_type = path.split('_')[1].split('.')[0];
  } catch (ex) {
    throw new Error('Invalid file name at: ' + path + ' must be in the form: "api_<name>.json"');
  }

  try {
    parsed_api = JSON.parse(fs.readFileSync(path));
  } catch (ex) {
    throw new Error('Could not read API definition file at: ' + path + ' ' + ex.message);
  }

  if (_.isUndefined(parsed_api[prefix])) {
    throw new Error('Could not find API definition at: ' + path + ' for prefix: ' + prefix);
  }

  api[api_type] = _.map(parsed_api[prefix], _.partial(Endpoint.create, config.get('vault_url')));

  return api;
}

function loadAPIDefinitions(config) {
  var
    paths = config.get('api_def_files'),
    prefix = config.get('prefix'),
    api_def;

  if (_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  api_def = _.reduce(paths, _.partial(readConfigFromPath, config), Object.create(null));

  config.set('api', api_def);

  return config;
}

