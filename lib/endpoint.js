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
 * @param {Object} config overrides any default configurations.
 * @return {Endpoint} Endpoint class reference
 */
module.exports = function setup(config) {
  config = config || {};
  if (_.isFunction(config.get) && config.has('debug') && config.get('debug') === true) {
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

  if (options.id) {
    name = name.replace(/:id/i, options.id);
  } else {
    name = name.replace(/\/:id/i, '');
  }
  return this.server_url + '/' + name;
};

Endpoint.prototype._createRequest = function _createRequest(verb, options) {
  var
    base_uri = this.getURI(options),
    request_opts;

  options = _.assign(options, this.defaults);

  request_opts = _.defaults(options, {
    uri: base_uri,
    json: true
  });

  return rp(request_opts);
};

Endpoint.prototype._validateRequest = function _validateRequest(method, options) {
  options = options || {};
  var
    verb = this.verbs[method],
    ctxreq;

  if (!method || _.isUndefined(verb)) {
    throw new Error('Unsupported method ' + method + ' for API ' + this.name);
  }

  if (verb.id === true && (_.isUndefined(options.id) || !options.id)) {
    throw new Error('Endpoint ' + method + ' ' + this.name + ' requires an id.');
  }

  if (!_.isEmpty(verb.params)) {
    // capture additional required based on context
    ctxreq = options._required;
    delete options._required;

    // check the params
    _.forEach(verb.params, function (param) {
      // check for required attributes
      if (param.required === true && !_.get(options, '_override', false) && (
          _.isUndefined(options.body) ||
          !options.body ||
          _.isUndefined(options.body[param.name]) ||
          !options.body[param.name])) {
        throw new Error('Missing required input ' + param.name);
      }
    });
    if (_.isString(ctxreq) && (
          _.isUndefined(options.body) ||
          !options.body ||
          _.isUndefined(_.get(options.body, ctxreq)) ||
          !_.get(options.body, ctxreq))) {
        throw new Error('Missing required input ' + ctxreq);
    }
  }

  options.method = method.toUpperCase();
  return this._createRequest(verb, options);
};

_.each(['get', 'post', 'put', 'delete'], function makeMethods(verb) {
  Endpoint.prototype[verb] = function (options) {
    return this._validateRequest(verb, options);
  };
});
