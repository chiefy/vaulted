'use strict';
var
  _ = require('lodash'),
  fs = require('fs');


var utils = module.exports;

function fileExists(location) {
  try {
    fs.statSync(location);
    return true;
  } catch (err) {
    return false;
  }
}

utils.setDefaults = function setDefaults(options, defaults) {
  options = _.isPlainObject(options) ? options : {};
  defaults = defaults || {};
  if (!_.isPlainObject(options.body)) {
    options.body = {};
  }
  options.body = _.defaults(options.body, defaults);
  return options;
};

utils.configured = function configured() {
  var flag = false;

  if (process.env.NODE_CONFIG_DIR) {
    flag = true;
  }

  if (fileExists(process.cwd() + '/config')) {
    flag = true;
  }
  return flag;
};
