var
  _ = require('lodash'),
  rp = require('request-promise'),
  Promise = require('bluebird');

require('request-debug')(rp);

module.exports = Endpoint;

function reduceVerbs(verbs, cur_verb) {
    var key;
    try {
      key =  _.keys(cur_verb)[0];
    } catch(ex) {
      return verbs;
    }
    verbs[key] = cur_verb[key];
    return verbs;
}


function Endpoint(options) {
  options = options || {};
  options.verbs = _.isArray(options.verbs) ? options.verbs : [];

  if (!options.name || options.name.length === 0) {
    throw new Error('Endpoint has no name defined.');
  }

  this.name = options.name;

  this.verbs = _.reduce(options.verbs, reduceVerbs, {});

  if (_.keys(this.verbs).length === 0) {
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

Endpoint.prototype.getURI = function getURL(options) {
  options = options || {};
  var name = this.name;

  if(options.id) {
    name = name.replace(/:id/i, options.id);
  }

  return this.server_url + '/' + name;
};

Endpoint.prototype._createRequest = function _createRequest(method, options) {
  options = options || {};
  method = method.toUpperCase();

  var
    verb = this.verbs[method],
    base_uri,
    request_opts;

  if (!method || _.isUndefined(verb)) {
    return Promise.reject(new Error('Could not find method ' + method + ' for API call: ' + this.name));
  }

  if(verb.id === true && _.isUndefined(options.id)) {
    return Promise.reject(new Error('Endpoint ' + method + ' ' + this.name + 'requires an id, none was given.'));
  }

  base_uri = this.getURI(options);

  request_opts = _.defaults(options, {
    method: method,
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

