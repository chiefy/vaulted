'use strict';
var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
  * @module audit
  * @extends Vaulted
  * @desc Provides implementation for the Vault Audit APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getAuditEndpoint = _.partial(Proto.validateEndpoint, 'sys/audit/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method getAuditMounts
 * @desc Gets the list of mounted audit backends for the vault.
 *
 * @param {string} [options.token] - the authentication token
 * @resolve {[Mounts]} Resolves with current list of mounted audit backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getAuditMounts = Promise.method(function getAuditMounts(options) {
  options = options || {};

  return this.getAuditEndpoint()
    .get({
      headers: this.headers,
      _token: options.token
    });
});

/**
 * @method enableAudit
 * @desc Enable a specific audit backend for use with the vault.
 *
 * @param {string} options.id - unique identifier for the audit mount
 * @param {string} options.body.type - the type of audit ('file', 'syslog')
 * @param {string} [options.body.description] - a description of the audit backend for operators.
 * @param {Object} [options.body.options] - options for configuring a specific type of audit backend
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableAudit = Promise.method(function enableAudit(options) {
  options = utils.setDefaults(options);
  return this.getAuditEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body,
      _required: options._required,
      _token: options.token
    });

});

/**
 * @method disableAudit
 * @desc Disable a specific audit backend from the vault.
 *
 * @param {string} options.id - unique identifier for the audit mount
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.disableAudit = Promise.method(function disableAudit(options) {
  options = utils.setDefaults(options);
  return this.getAuditEndpoint()
    .delete({
      headers: this.headers,
      id: options.id,
      _token: options.token
    });
});

/**
 * @method enableFileAudit
 * @desc Convenience method to enable the `file` audit backend for use with the vault.
 *
 * @param {string} options.id - unique identifier for the file audit mount
 * @param {string} options.body.path - the directory where to write the audit files
 * @param {string} [options.body.description] - a description of the file audit backend for operators.
 * @param {boolean} [options.body.log_raw=false] - should security sensitive information be logged raw.
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableFileAudit = Promise.method(function enableFileAudit(options) {
  options = utils.setDefaults(options);
  var fileOptions = {
    id: options.id,
    body: {
      type: 'file',
      description: options.body.description || 'File Audit ' + options.id,
      options: {
        path: options.body.path,
        log_raw: options.body.log_raw || 'false'
      }
    },
    _required: 'options.path',
    token: options.token
  };

  return this.enableAudit(fileOptions);
});

/**
 * @method enableSyslogAudit
 * @desc Convenience method to enable the `syslog` audit backend for use with the vault.
 *
 * @param {string} options.id - unique identifier for the syslog audit mount
 * @param {string} [options.body.description] - a description of the syslog audit backend for operators.
 * @param {string} [options.body.facility=AUTH] - syslog facility to use.
 * @param {string} [options.body.tag=vault] - syslog tag to use.
 * @param {boolean} [options.body.log_raw=false] - should security sensitive information be logged raw.
 * @param {string} [options.token] - the authentication token
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableSyslogAudit = Promise.method(function enableSyslogAudit(options) {
  options = utils.setDefaults(options);
  var syslogOptions = {
    id: options.id,
    body: {
      type: 'syslog',
      description: options.body.description || 'Syslog Audit ' + options.id,
      options: {
        facility: options.body.facility || 'AUTH',
        tag: options.body.tag || 'vault',
        log_raw: options.body.log_raw || 'false'
      }
    },
    token: options.token
  };

  return this.enableAudit(syslogOptions);
});
