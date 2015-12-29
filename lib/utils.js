var
  _ = require('lodash');


var utils = module.exports;

utils.setDefaults = function setDefaults(options, defaults) {
  options = options || {};
  defaults = defaults || {};
  if (!_.isPlainObject(options.body)) {
    options.body = {};
  }
  options.body = _.defaults(options.body, defaults);
  return options;
};
