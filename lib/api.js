'use strict';
var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  url = require('url'),
  util = require('util'),
  Endpoint;

/**
 * @module api
 * @desc Provides public facade layer around API endpoints.
 * @private
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
var API_SPECS = path.normalize(path.join(__dirname, '..', 'config', 'specs.yml'));
/** @constant
    @type {string}
    @default
*/
var API_PREFIX = 'v1';

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
    return {
      proxy: url.format(proxy)
    };
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

function load(config, metadata) {
  var
    defaults = {},
    base_url = getVaultURL(config) + '/' + API_PREFIX,
    partial;

  if (config.has('timeout')) {
    defaults.timeout = config.get('timeout');
  }

  defaults = _.assign(defaults, getSSLOptions(config));
  defaults = _.assign(defaults, getProxy(config));

  partial = _.partial(Endpoint.create, base_url, defaults);
  return _.transform(metadata, partial, {});
}

function loadAPISpecs(thisAPI, config, type, namespace) {
  namespace = namespace || type;
  var spec;

  if (_.isEmpty(thisAPI.specs)) {
    // could throw an error but properly installed and tested means custom
    // error handler could hide root issue
    thisAPI.specs = yaml.safeLoad(fs.readFileSync(API_SPECS, 'utf8'));
  }

  spec = _.mapKeys(thisAPI.specs[API_PREFIX][type], function (value, key) {
    return util.format(key, namespace);
  });

  return load(config, spec);
}

function loadAPIDefinitions(config) {
  var parsed_api;

  // could throw an error but properly installed and tested means custom
  // error handler could hide root issue
  parsed_api = yaml.safeLoad(fs.readFileSync(API_DEFINITIONS, 'utf8'));

  return load(config, parsed_api[API_PREFIX]);
}

/**
 * @private
 * @constructor API
 *
 * @param {Object} config overrides any default configurations.
 */
function API(config) {
  if (_.isUndefined(config) || _.isUndefined(config.get)) {
    throw new Error('API must be configurations object');
  }
  Endpoint = require('./endpoint')(config);

  /** @member {Object} */
  this.endpoints = {};
  /** @member {Object} */
  this.specs = {};

  _.extend(this.endpoints, loadAPIDefinitions(config));
  // default auth backend
  _.extend(this.endpoints, loadAPISpecs(this, config, 'token'));
  // default secret backend
  _.extend(this.endpoints, loadAPISpecs(this, config, 'secret'));
}

/**
 * @method mountEndpoints
 * @desc Mounts a set of Endpoints from a given spec type to a specified namespace.
 *
 * @param {Object} config overrides any default configurations.
 * @param {String} type the name of the spec that references a set of Endpoints.
 * @param {String} namespace the name to mount a specified set of Endpoints to.
 * @throws {Error} namespace not provided or has no length.
 * @throws {Error} type not provided or has no length.
 * @throws {Error} Could not find type in defintions.
 */
API.prototype.mountEndpoints = function mountEndpoints(config, type, namespace) {
  if (_.isUndefined(config) || _.isUndefined(config.get)) {
    throw new Error('configuration object not provided.');
  }
  if (!_.isString(type) || type.length === 0) {
    throw new Error('type not provided or has no length.');
  }
  if (!_.isString(namespace) || namespace.length === 0) {
    throw new Error('namespace not provided or has no length.');
  }
  _.extend(this.endpoints, loadAPISpecs(this, config, type, namespace));
};

/**
 * @method unmountEndpoints
 * @desc Unmounts a set of Endpoints from a specified namespace.
 *
 * @param {String} namespace the name associated with Endpoints to unmount .
 * @throws {Error} namespace not provided or has no length.
 * @throws {Error} Could not find namespace in APIs.
 */
API.prototype.unmountEndpoints = function unmountEndpoints(namespace) {
  if (!_.isString(namespace) || namespace.length === 0) {
    throw new Error('namespace not provided or has no length.');
  }
  var self = this;
  _.filter(_.keys(this.endpoints), function (key) {
    if (_.includes(key, namespace)) {
      delete self.endpoints[key];
    }
  });
};

/**
 * @method getEndpoint
 * @desc Retrieves the named endpoint.
 *
 * @param {String} endpoint the name / path of the defined endpoint.
 * @return {EndPoint} An instance matching the specificed name.
 * @throws {Error} Endpoint not provided or has no length.
 * @throws {Error} Could not find endpoint: {endpoint_name} in API defintions
 */
API.prototype.getEndpoint = function getEndpoint(endpoint_name) {
  if (!_.isString(endpoint_name) || endpoint_name.length === 0) {
    throw new Error('Endpoint not provided or has no length.');
  }
  var endpoint = _.get(this.endpoints, endpoint_name);

  if (_.isUndefined(endpoint)) {
    throw new Error('Could not find endpoint: ' + endpoint_name + ' in API defintions');
  }
  return endpoint;
};

module.exports = API;
