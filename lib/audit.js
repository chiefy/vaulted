var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

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
 * @resolve {[Mounts]} Resolves with current list of mounted audit backends
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getAuditMounts = Promise.method(function getAuditMounts() {
  return this.getAuditEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * @method enableAudit
 * @desc Enable a specific audit backend for use with the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the audit mount
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.type - the type of audit ('file', 'syslog')
 * @param {string} [options.body.description] - a description of the audit backend for operators.
 * @param {Object} [options.body.options] - options for configuring a specific type of audit backend
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableAudit = Promise.method(function enableAudit(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide audit id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide audit details.'));
  }
  if (_.isUndefined(options.body.type) || !options.body.type) {
    return Promise.reject(new Error('You must provide audit type.'));
  }
  if (_.isUndefined(options.body.options)) {
    options.body.options = {};
  }

  return this.getAuditEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: {
        type: options.body.type,
        description: options.body.description,
        options: options.body.options
      }
    });

});

/**
 * @method disableAudit
 * @desc Disable a specific audit backend from the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the audit mount
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.disableAudit = Promise.method(function disableAudit(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide audit id.'));
  }

  return this.getAuditEndpoint()
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method enableFileAudit
 * @desc Convenience method to enable the `file` audit backend for use with the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the file audit mount
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.path - the directory where to write the audit files
 * @param {string} [options.body.description] - a description of the file audit backend for operators.
 * @param {boolean} [options.body.log_raw=false] - should security sensitive information be logged raw.
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableFileAudit = Promise.method(function enableFileAudit(options) {
  var fileOptions;
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide audit id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide audit details.'));
  }
  if (_.isUndefined(options.body.path) || !options.body.path) {
    return Promise.reject(new Error('You must provide audit file path.'));
  }

  fileOptions = {
    id: options.id,
    body: {
      type: 'file',
      description: options.body.description || 'File Audit ' + options.id,
      options: {
        path: options.body.path,
        log_raw: options.body.log_raw || 'false'
      }
    }
  };

  return this.enableAudit(fileOptions);
});

/**
 * @method enableSyslogAudit
 * @desc Convenience method to enable the `syslog` audit backend for use with the vault.
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the syslog audit mount
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} [options.body.description] - a description of the syslog audit backend for operators.
 * @param {string} [options.body.facility=AUTH] - syslog facility to use.
 * @param {string} [options.body.tag=vault] - syslog tag to use.
 * @param {boolean} [options.body.log_raw=false] - should security sensitive information be logged raw.
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.enableSyslogAudit = Promise.method(function enableSyslogAudit(options) {
  var syslogOptions;
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide audit id.'));
  }
  if (!_.isPlainObject(options.body)) {
    options.body = {};
  }

  syslogOptions = {
    id: options.id,
    body: {
      type: 'syslog',
      description: options.body.description || 'Syslog Audit ' + options.id,
      options: {
        facility: options.body.facility || 'AUTH',
        tag: options.body.tag || 'vault',
        log_raw: options.body.log_raw || 'false'
      }
    }
  };

  return this.enableAudit(syslogOptions);
});
