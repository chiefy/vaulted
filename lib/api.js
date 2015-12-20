var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  url = require('url'),
  Endpoint;

/**
  * @module api
  * @desc Provides public facade layer around API endpoints.
  *
 */


/** @constant
    @type {string}
    @default
*/
var API_DEFINITIONS = path.normalize(path.join(__dirname, '..', 'config', 'apis.yml'));
/** @constant
    @type {string}
    @default
*/
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

function getSSLOptions(config) {
  var options = {};

  if (config.has('ssl_cert_file')) {
    options.cert = fs.readFileSync(config.get('ssl_cert_file'));
  }

  if (config.has('ssl_pem_file')) {
    options.key = fs.readFileSync(config.get('ssl_pem_file'));
  }

  if (config.has('ssl_pem_passphrase')) {
    options.passphrase = config.get('ssl_pem_passphrase');
  }

  if (config.has('ssl_ca_cert')) {
    options.ca = fs.readFileSync(config.get('ssl_ca_cert'));
  }

  options.ciphers = config.get('ssl_ciphers');
  options.rejectUnauthorized = config.get('ssl_verify');

  return options;
}

function getProxy(config) {
  var proxy = {};

  if (config.has('proxy_address') && config.has('proxy_port')) {
    proxy.hostname = config.get('proxy_address');
    proxy.port = config.get('proxy_port');
  }

  if (config.has('proxy_username') && config.has('proxy_password')) {
    proxy.auth = config.get('proxy_username') + ':' + config.get('proxy_password');
  }

  if (!_.isEmpty(proxy)) {
    proxy.protocol = config.get('vault_ssl') === true ? 'https' : 'http';
    return {proxy: url.format(proxy)};
  }

  return proxy;
}

function getVaultURL(config) {
  return url.format({
    hostname: config.get('vault_host'),
    port: config.get('vault_port'),
    protocol: config.get('vault_ssl') === true ? 'https' : 'http'
  });
}

API.prototype._loadAPIDefinitions = function _loadAPIDefinitions(config) {
  var
    defaults = {},
    base_url = getVaultURL(config) + '/' + API_PREFIX,
    partial,
    parsed_api;

  if (config.has('timeout')) {
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
 * @method getEndpoint
 * @desc Retrieves the named endpoint.
 *
 * @param {String} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 * @throws {Error} - Endpoint not provided or has no length.
 * @throws {Error} - Could not find endpoint: {endpoint_name} in API defintions
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
