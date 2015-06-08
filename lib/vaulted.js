var
  _ = require('lodash'),
  fs = require('fs'),
  vaulted_config = require('./config.js');

module.exports = Vault;

function Vault(config) {
  config = config || {};
  this.config = vaulted_config(config);
  this.config.set('api', this.load_api());
}

Vault.prototype.load_api = function() {
  var
    prefix = this.config.get('prefix'),
    api_def = null;

  if(_.isEmpty(prefix)) {
    throw new Error('Could not get API version to load defintion file.');
  }

  try {
    api_def = JSON.parse(fs.readFileSync('config/api.json'));
    api_def = api_def[prefix];
    if(_.isUndefined(api_def)) {
      throw new Error();
    }
  } catch(ex) {
    throw new Error('Could not read API definition file for' + prefix + ' : ' + ex.message);
  }

  return api_def;
};
