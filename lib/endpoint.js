var
  _ = require('lodash'),
  rp = require('request-promise'),
  Promise = require('bluebird');

require('request-debug')(rp);

module.exports = Endpoint;

function Endpoint(options) {
  options = options || {};
  if (!options.name || options.name.length === 0) {
    throw new Error('Endpoint has no name defined.');
  }
  this.name = options.name;
  this.verbs = _.isArray(options.verbs) ? options.verbs : [];
  if (this.verbs.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no verbs defined.');
  }
  if (!_.isString(options.base_url) || options.base_url.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no base URL defined');
  }
  this.server_url = options.base_url;
}

Endpoint.create = function create(url, options) {
  return new Endpoint(_.defaults(options, {
    base_url: url
  }));
};

Endpoint.prototype.getURI = function() {
  return this.server_url + '/' + this.name;
};

Endpoint.prototype._createRequest = function(method, options) {
  options = options || {};
  var base_uri, request_opts;

  if (!method || !this.verbs[method.toUpperCase()]) {
    console.dir(this.verbs);
    return Promise.reject(new Error('Could not find method ' + method.toUpperCase() + ' for API call: ' + this.name));
  }

  base_uri = this.getURI();

  request_opts = _.defaults(options, {
    method: method,
    uri: base_uri
  });

  return rp(request_opts);
};

_.each(['get','post','put','delete'], function makeMethods(verb) {
  Endpoint.prototype[verb] = function(options) {
    return this._createRequest(verb, options);
  };
});

