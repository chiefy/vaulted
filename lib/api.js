var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint = require('./endpoint');

module.exports = function setup(config) {
  return loadAPIDefinitions(config);
};

function readConfigFromPath(config, api, path) {
  var
    prefix = config.get('prefix'),
    api_type,
    partial,
    parsed_api;

  try {
    api_type = path.split('_')[1].split('.')[0];
    path =  __dirname + '/../' + path;
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

  partial = _.partial(Endpoint.create, config.get('vault_url'));
  api[api_type] = _.map(parsed_api[prefix], partial);

  return api;
}

function loadAPIDefinitions(config) {
  var
    paths = config.get('api_def_files'),
    prefix = config.get('prefix'),
    partial,
    api_def;

  if (_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  partial = _.partial(readConfigFromPath, config);
  api_def = _.reduce(paths, partial, Object.create(null));

  return api_def;
}