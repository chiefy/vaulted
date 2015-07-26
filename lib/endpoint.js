var
  _ = require('lodash'),
  request = require('request'),
  Promise = require('bluebird');

module.exports = Endpoint;

function Endpoint(options) {
  options = options || {};
  if(!options.name || options.name.length === 0) {
    throw new Error('Endpoint has no name defined.');
  }
  this.name = options.name;
  this.verbs = _.isArray(options.verbs) ? options.verbs : [];
  if(this.verbs.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no verbs defined.');
  }
  if(!_.isString(options.base_url) || options.base_url.length === 0) {
    throw new Error('Endpoint ' + this.name + ' has no base URL defined');
  }
  this.server_url = options.base_url;
}

Endpoint.create = function create(url, options) {
  return new Endpoint(_.defaults(options, { base_url: url }));
};

Endpoint.prototype.getURI = function() {
  return this.server_url + '/' + this.name;
};

Endpoint.prototype._createRequest = function(method, options) {
  options = options || {};
  if(!method || !this.verbs[options.method]) {
    return false;
  }
  var base_uri = this.getURI();
};

Endpoint.prototype.get = function(options) {
  return this._createRequest('get', options);
};

Endpoint.prototype.put = function(options) {
  return this._createRequest('put', options);
};

Endpoint.prototype.post = function(options) {
  return this._createRequest('post', options);
};

Endpoint.prototype.delete = function(options) {
  return this._createRequest('delete', options);
};


