var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getAuditEndpoint = _.partial(Proto.validateEndpoint, 'sys/audit/:id');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the list of mounted audit backends for the vault.
 *
 * @return {Promise<Object>} Promise which is resolved with current list
 * of mounted audit backends.
 */
Vaulted.getAuditMounts = Promise.method(function getAuditMounts() {
  return this.getAuditEndpoint()
    .get({
      headers: this.headers
    });
});

/**
 * Enable a specific audit backend for use with the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise} Promise
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
    })

});

/**
 * Disable a specific audit backend from the vault.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise} Promise
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
 * Convenience method to enable the `file` audit backend for use with the vault.
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise} Promise
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
 * Convenience method to enable the `syslog` audit backend for use with the vault.
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise} Promise
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
