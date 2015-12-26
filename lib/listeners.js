var
  Vaulted = {},
  _ = require('lodash'),
  internal = require('./internal');

/**
 * @module listeners
 * @extends Vaulted
 * @desc Provides listeners for events within Vaulted
 *
 */

module.exports = function extend(Proto) {
  _.extend(Proto, Vaulted);
};

Vaulted.enableListeners = function enableListeners() {
  var self = this;

  self.on('init', function () {
    internal.backup(self);
  });

  self.on('unsealed', function () {
    internal.loadState(self).then(function () {
      internal.syncMounts(self);
    });
  });

  self.on('mount', function (type, namespace) {
    self.api.mountEndpoints(self.config, type, namespace);
  });

  self.on('unmount', function (namespace) {
    self.api.unmountEndpoints(namespace);
  });

};

Vaulted.disableListeners = function disableListeners(event) {
  this.removeAllListeners(event);
};
