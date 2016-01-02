var
  _ = require('lodash'),
  rp = require('request-promise'),
  path = require('path'),
  Hooks = require('./hooks');

var hooks = new Hooks();

/**
 * @module endpoint
 * @desc Implements the request wrapper around actual API endpoints.
 *
 */

function validateHeader(verb, options) {
  // if header not provided then no need to check anything
  if (_.has(options, 'headers')) {
    var token = options._token;

    if (token) {
      options.headers = {
        'X-Vault-Token': token
      };
    }

    if (_.isEmpty(options.headers)) {
      throw new Error('Missing auth token');
    }
  }

  return options;
}

hooks.pre('_createRequest', validateHeader);

function validateId(verb, options) {
  var idRequired = false;

  if (_.has(options, '_required') && options._required === 'id') {
    idRequired = true;
    delete options._required;
  }

  if ((verb.id === true || idRequired) &&
    (_.isUndefined(options.id) || !options.id)) {
    throw new Error('Endpoint requires an id.');
  }

  return options;
}

hooks.pre('_createRequest', validateId);

function validateBody(verb, options) {
  var ctxreq;

  if (!_.isEmpty(verb.params)) {
    ctxreq = options._required;
    delete options._required;

    // check the params
    _.forEach(verb.params, function (param) {
      // check for required attributes
      if (param.required === true && !_.get(options, '_override', false) && (
          _.isEmpty(options.body) ||
          _.isUndefined(options.body[param.name]) ||
          !options.body[param.name])) {
        throw new Error('Missing required input ' + param.name);
      }
    });

    if (_.isString(ctxreq) && (
        _.isEmpty(options.body) ||
        _.isUndefined(_.get(options.body, ctxreq)) ||
        !_.get(options.body, ctxreq))) {
      throw new Error('Missing required input ' + ctxreq);
    }
  }

  return options;
}

hooks.pre('_createRequest', validateBody);

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
 * @param {Object} options - object of options to configure the Endpoint
 * @param {string} options.name - the name / API path
 * @param {string} options.base_url - the base Vault server url
 * @param {Object} options.verbs - the methods defined for the Endpoint
 * @param {Object} [options.defaults={}] - the default request options
 */
function Endpoint(options) {
  options = options || {};

  /** @member {Object} */
  this.defaults = {};
  if (!_.isEmpty(options.defaults)) {
    this.defaults = options.defaults;
  }

  if (!options.name || options.name.length === 0) {
    throw new Error('Endpoint has no name defined.');
  }
  /** @member {string} */
  this.name = options.name;

  if (!_.isString(options.base_url) || options.base_url.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no base URL defined');
  }
  /** @member {string} */
  this.server_url = options.base_url;

  if (_.keys(options.verbs).length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no verbs defined.');
  }
  /** @member {Object} */
  this.verbs = options.verbs;
}

/**
 * Helper function to create a new instance of Endpoint
 *
 * @param {String} url - the base Vault server url
 * @param {Object} defaults - the default request options
 * @param {Object} apis - an object containing named APIs
 * @param {Object} verbs - the methods defined for the Endpoint.
 * @param {string} name - the name / API path
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

function formatPath(name, options) {
  if (options.id) {
    name = name.replace(/:id/i, options.id);
  } else {
    name = name.replace(/\/:id/i, '');
  }
  return path.posix.normalize(name);
};

function createRequest(ep, options) {
  options = _.assign(options, ep.defaults);

  var request_opts = _.defaults(options, {
    uri: ep.server_url + '/' + formatPath(ep.name, options),
    json: true
  });
  return rp(request_opts);
};

function impl(method, options) {
  options = options || {};
  var verb = this.verbs[method];

  if (!method || _.isUndefined(verb)) {
    throw new Error('Unsupported method ' + method + ' for API ' + this.name);
  }

  hooks.execPre('_createRequest', this, [verb, options]);

  options.method = method.toUpperCase();
  return createRequest(this, options);
}

/**
 * @method get
 * @desc Performs a get request operation for the named endpoint.
 *
 * @param {String} method - the verb name.
 * @param {Object} options - the request inputs.
 * @return {Promise}
 */
Endpoint.prototype.get = _.partial(impl, 'get');

/**
 * @method put
 * @desc Performs a put request operation for the named endpoint.
 *
 * @param {String} method - the verb name.
 * @param {Object} options - the request inputs.
 * @return {Promise}
 */
Endpoint.prototype.put = _.partial(impl, 'put');

/**
 * @method post
 * @desc Performs a post request operation for the named endpoint.
 *
 * @param {String} method - the verb name.
 * @param {Object} options - the request inputs.
 * @return {Promise}
 */
Endpoint.prototype.post = _.partial(impl, 'post');

/**
 * @method delete
 * @desc Performs a delete request operation for the named endpoint.
 *
 * @param {String} method - the verb name.
 * @param {Object} options - the request inputs.
 * @return {Promise}
 */
Endpoint.prototype.delete = _.partial(impl, 'delete');
