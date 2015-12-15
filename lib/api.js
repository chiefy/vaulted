var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  url = require('url'),
  Endpoint;

var API_DEFINITIONS = path.normalize(path.join(__dirname, '..', 'config', 'apis.yml'));
var API_PREFIX = 'v1';

/**
 * API constructor
 *
 * @constructor
 * @param {Object} config overrides any configuration set by node-convict setup.
 */
function API(config) {
  if(_.isUndefined(config) || _.isUndefined(config.get)) {
    throw new Error('API must be instantiated with a node-convict based object');
  }
  Endpoint = require('./endpoint')(config);
  _.extend(this, this._loadAPIDefinitions(config));
}

function _isString(value) {

  if (_.isString(value) && value.length > 0) {
    return true;
  }
  return false;
}

function getSSLOptions(config) {
  var options = {};

  if (_isString(config.get('ssl_cert_file'))) {
    options.cert = fs.readFileSync(config.get('ssl_cert_file'));
  }

  if (_isString(config.get('ssl_pem_file'))) {
    options.key = fs.readFileSync(config.get('ssl_pem_file'));
  }

  if (_isString(config.get('ssl_pem_passphrase'))) {
    options.passphrase = config.get('ssl_pem_passphrase');
  }

  if (_isString(config.get('ssl_ca_cert'))) {
    options.ca = fs.readFileSync(config.get('ssl_ca_cert'));
  }

  options.ciphers = config.get('ssl_ciphers');
  options.rejectUnauthorized = config.get('ssl_verify');

  return options;
}

function getProxy(config) {
  var proxy = {};

  if (_isString(config.get('proxy_address')) && _isString(config.get('proxy_port'))) {
    proxy.hostname = config.get('proxy_address');
    proxy.port = config.get('proxy_port');
  }

  if (_isString(config.get('proxy_username')) && _isString(config.get('proxy_password'))) {
    proxy.auth = config.get('proxy_username') + ':' + config.get('proxy_password');
  }

  if (!_.isEmpty(proxy)) {
    proxy.protocol = config.get('vault_ssl') === 1 ? 'https' : 'http';
    return {proxy: url.format(proxy)};
  }

  return proxy;
}

API.prototype._loadAPIDefinitions = function _loadAPIDefinitions(config) {
  var
    defaults = {},
    base_url = config.get('vault_url') + '/' + API_PREFIX,
    partial,
    parsed_api;

  if (_.isNumber(config.get('timeout'))) {
    defaults.timeout = config.get('timeout');
  }

  defaults = _.assign(defaults, getSSLOptions(config));
  defaults = _.assign(defaults, getProxy(config));

  // could throw an error but properly installed and tested means custom
  // error handler could hide root issue
  parsed_api = yaml.safeLoad(fs.readFileSync(API_DEFINITIONS, 'utf8'));

  partial = _.partial(Endpoint.create, base_url, defaults);
  return _.transform(parsed_api[API_PREFIX], partial, {});
};

/**
 * Retrieves the named endpoint.
 *
 * @param {String} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 */
API.prototype.getEndpoint = function getEndpoint(endpoint_name) {
  if (!_.isString(endpoint_name) || endpoint_name.length === 0) {
    throw new Error('Endpoint not provided or has no length.');
  }
  var endpoint = _.get(this, endpoint_name);

  if (_.isUndefined(endpoint)) {
    throw new Error('Could not find endpoint: ' + endpoint_name + ' in API defintions');
  }
  return endpoint;
};

module.exports = API;
