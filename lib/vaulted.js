var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint = require('./endpoint.js'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};

  var api_def_files;

  this.config = vaulted_config(config);
  api_def_files = this.config.get('api_def_files');
  this.config.set('apis', this.load_api(api_def_files));

  this.config.set('headers', {
    'X-Vault-Token': null
  });

}

Vault.prototype.load_api = function(paths) {
  var
    prefix = this.config.get('prefix'),
    api_def = {};

  if (_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  function readConfig(api, path) {
    var
      api_type,
      parsed_api;

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

    api[api_type] = _.map(parsed_api[prefix], _.partial(Endpoint.create, this.config.get('addr')));

    return api;
  }

  api_def = _.reduce(paths, readConfig, Object.create(null), this);

  return api_def;
};
