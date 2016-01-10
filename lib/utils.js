'use strict';
var
  _ = require('lodash');


var utils = module.exports;

utils.setDefaults = function setDefaults(options, defaults) {
  options = _.isPlainObject(options) ? options : {};
  defaults = defaults || {};
  if (!_.isPlainObject(options.body)) {
    options.body = {};
  }
  options.body = _.defaults(options.body, defaults);
  return options;
};
