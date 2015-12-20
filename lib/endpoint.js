var
  _ = require('lodash'),
  rp = require('request-promise'),
  Promise = require('bluebird');

/**
  * @module endpoint
  * @desc Implements the request wrapper around actual API endpoints.
  *
 */


/**
 * Setup function for Endpoint module; provides debug support and returns
 * the Endpoint class.
 *
 * @param {Object} config overrides any configuration set by node-convict setup.
 * @return {Endpoint} Endpoint class reference
 */
module.exports = function setup(config) {
  config = config || {};
  if(_.isFunction(config.get) && config.has('debug') && config.get('debug') === true) {
    require('request-debug')(rp);
  }
  return Endpoint;
};

/**
 * Endpoint constructor
 *
 * @constructor
 * @param  {Object} options Hash of options create the Endpoint, keys "name", "verbs", "base_url" required.
 */
function Endpoint(options) {
  options = options || {};

  this.defaults = {};
  if (!_.isEmpty(options.defaults)) {
    this.defaults = options.defaults;
  }

  if (!options.name || options.name.length === 0) {
    throw new Error('Endpoint has no name defined.');
  }
  this.name = options.name;

  if (!_.isString(options.base_url) || options.base_url.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no base URL defined');
  }
  this.server_url = options.base_url;

  if (_.keys(options.verbs).length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no verbs defined.');
  }
  this.verbs = options.verbs;
}

/**
 * Helper function to create a new instance of Endpoint
 *
 * @param  {String} url base url for the endpoint
 * @param  {Object} verbs Hash of methods available for an Endpoint.
 * @return {Endpoint} new instance of Endpoint
 */
Endpoint.create = function create(url, defaults, apis, verbs, name) {
  apis[name] = new Endpoint({
    base_url: url,
    defaults: defaults,
    name: name,
    verbs: verbs
  });
  return apis;
};

/**
 * Generates a formatted url for the Endpoint
 *
 * @param  {Object} options Hash of options, keys "id" supported.
 * @return {Endpoint} new instance of Endpoint
 */
Endpoint.prototype.getURI = function getURL(options) {
  options = options || {};
  var name = this.name;

  if(options.id) {
    name = name.replace(/:id/i, options.id);
  } else {
    name = name.replace(/\/:id/i,'');
  }
  return this.server_url + '/' + name;
};

Endpoint.prototype._createRequest = function _createRequest(method, options) {
  options = options || {};

  var
    verb = this.verbs[method],
    base_uri,
    request_opts;

  if (!method || _.isUndefined(verb)) {
    return Promise.reject(new Error('Could not find method ' + method + ' for API call: ' + this.name));
  }

  if(verb.id === true && _.isUndefined(options.id)) {
    return Promise.reject(new Error('Endpoint ' + method + ' ' + this.name + ' requires an id, none was given.'));
  }

  base_uri = this.getURI(options);
  options = _.assign(options, this.defaults);

  request_opts = _.defaults(options, {
    method: method.toUpperCase(),
    uri: base_uri,
    json: true
  });

  return rp(request_opts);
};

_.each(['get','post','put','delete'], function makeMethods(verb) {
  Endpoint.prototype[verb] = function(options) {
    return this._createRequest(verb, options);
  };
});
