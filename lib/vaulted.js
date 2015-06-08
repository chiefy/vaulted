var
  _ = require('lodash'),
  fs = require('fs'),
  Endpoint = require('./endpoint.js'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};
  this.config = vaulted_config(config);
  this.config.set('api', this.load_api());
  this.headers = {
    'X-Vault-Token': null
  };
}

Vault.prototype.load_api = function() {
  var
    prefix = this.config.get('prefix'),
    api_def_path = this.config.get('api_def'),
    api_def;

  if (_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  try {
    api_def = JSON.parse(fs.readFileSync(api_def_path));
  } catch (ex) {
    throw new Error('Could not read API definition file: ' + ex.message);
  }

  api_def = api_def[prefix];

  if (_.isUndefined(api_def)) {
    throw new Error('Could not find API definition for prefix: ' + prefix);
  }

  api_def = _.reduce(api_def, function reduceAPI(new_api_def, def) {
    var endpoint = new Endpoint(def);
    new_api_def[def.name] = endpoint;
    return new_api_def;
  }, Object.create(null));

  return api_def;
};
