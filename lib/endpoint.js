var
  _ = require('lodash'),
  rp = require('request-promise'),
  path = require('path');

/**
 * @module endpoint
 * @desc Implements the request wrapper around actual API endpoints.
 *
 */

function validateHeader(verb, options) {
  // if header not provided then no need to check anything
  if (_.has(options, 'headers')) {
    var token = options._token;
    delete options._token;

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

  this.hooks = [];

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

  apis[name].use(validateHeader);
  apis[name].use(validateId);
  apis[name].use(validateBody);

  return apis;
};

Endpoint.prototype.use = function use(fn) {
  this.hooks.push(fn);
  return this;
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
  return this.server_url + '/' + path.posix.normalize(name);
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

_.each(['get', 'post', 'put', 'delete'], function makeMethods(method) {
  Endpoint.prototype[method] = function (options) {
    options = options || {};
    var verb = this.verbs[method];

    if (!method || _.isUndefined(verb)) {
      throw new Error('Unsupported method ' + method + ' for API ' + this.name);
    }

    _.forEach(this.hooks, function (fn) {
      options = fn(verb, options);
    });

    options.method = method.toUpperCase();
    return this._createRequest(verb, options);
  };
});
