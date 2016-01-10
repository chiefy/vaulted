'use strict';
var
  _ = require('lodash'),
  debuglog = require('util').debuglog('vaulted');


/**
  * @module internal
  * @desc Provides internal helpers for working with the Vault.
  *
 */

var internal = module.exports;

function checkStatus(vault, status) {
  if (!status.initialized) {
    debuglog('either vault not initialized');
    return vault;
  }
  return vault.getSealedStatus().bind(vault)
    .then(vault.getMounts)
    .then(vault.getAuthMounts)
    .then(function () {
      debuglog('internal state loaded');
      return vault;
    }).
    catch(function onError(err) {
      debuglog('failed to retrieve state: %s', err.message);
      return vault;
    });
}

/**
 * @private
 * @method loadState
 * @desc Load retrieve the current state of the vault and sets internal properties accordingly
 *
 * @param {Vaulted} vault an instance of Vaulted.
 * @resolve {Vaulted} Resolves with current instance of Vaulted
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
internal.loadState = function loadState(vault) {
  return vault.getInitStatus().bind(vault)
    .then(_.partial(checkStatus, vault));
};

/**
 * @private
 * @method syncMounts
 * @desc Sync the existing mounts with mounted/exposed APIs.
 *
 * @param {Vaulted} vault an instance of Vaulted.
 */
internal.syncMounts = function syncMounts(vault) {
  var match;

  _.forEach(vault.mounts, function (mount, name) {
    match = _.find(_.keys(vault.api.endpoints), _.matches(name));
    if (!match) {
      vault.api.mountEndpoints(vault.config, mount.type, name);
    }
  });

  _.forEach(vault.auths, function (auth, name) {
    match = _.find(_.keys(vault.api.endpoints), _.matches('auth/' + name));
    if (!match) {
      vault.api.mountEndpoints(vault.config, auth.type, name);
    }
  });

};
