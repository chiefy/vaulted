var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
  * @module backend/consul
  * @extends Vaulted
  * @desc Provides implementation for the Vault Consul Secret backend APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getConsulRolesEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/roles/:id'), 'consul');
  Vaulted.getConsulCredsEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/creds/:id'), 'consul');
  Vaulted.getConsulAccessEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/config/access'), 'consul');
  _.extend(Proto, Vaulted);
};

/**
 * @method configConsulAccess
 * @desc Configures the access information for Consul secret backend
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.address - address of the Consul instance, provided as host:port
 * @param {string} options.body.token - Consul ACL token to use; must be a management type token
 * @param {string} [options.body.scheme=HTTP] - URL scheme to use
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=consul] - path name the consul secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.configConsulAccess = Promise.method(function configConsulAccess(options, mountName) {
  options = options || {};

  return this.getConsulAccessEndpoint(mountName).post({
    headers: this.headers,
    body: options.body,
    _token: options.token
  });
});

/**
 * @method createConsulRole
 * @desc Creates or updates the Consul role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.policy - base64 encoded Consul ACL policy
 * @param {string} [options.body.token_type=client] - type of token to create using this role ('client', 'management')
 * @param {string} [options.body.lease] - lease value provided as a string duration with time suffix
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=consul] - path name the consul secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createConsulRole = Promise.method(function createConsulRole(options, mountName) {
  var override = false;

  options = utils.setDefaults(options);
  if (_.isString(options.body.policy)) {
    // According to documentation the policy must be base64 encoded; easier to handle this
    // here vs. each user having to do this manually.
    options.body.policy = new Buffer(options.body.policy).toString('base64');
  } else {
    if (options.body.token_type === 'management') {
      override = true;
    }
  }

  return this.getConsulRolesEndpoint(mountName).post({
    headers: this.headers,
    id: options.id,
    body: options.body,
    _override: override,
    _token: options.token
  });
});

/**
 * @method getConsulRole
 * @desc Retrieve a specified Consul role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=consul] - path name the consul secret backend is mounted on
 * @resolve {Role} Consul role structure
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getConsulRole = Promise.method(function getConsulRole(options, mountName) {
  options = options || {};

  return this.getConsulRolesEndpoint(mountName).get({
    headers: this.headers,
    id: options.id,
    _token: options.token
  });
});

/**
 * @method deleteConsulRole
 * @desc Removes a specified Consul role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=consul] - path name the consul secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteConsulRole = Promise.method(function deleteConsulRole(options, mountName) {
  options = options || {};

  return this.getConsulRolesEndpoint(mountName).delete({
    headers: this.headers,
    id: options.id,
    _token: options.token
  });
});

/**
 * @method generateConsulRoleToken
 * @desc Generate a dynamic Consul token based on the role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @param {string} [options.token] - the authentication token
 * @param {string} [mountName=consul] - path name the consul secret backend is mounted on
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.generateConsulRoleToken = Promise.method(function generateConsulRoleToken(options, mountName) {
  options = options || {};

  return this.getConsulCredsEndpoint(mountName).get({
    headers: this.headers,
    id: options.id,
    _token: options.token
  });
});
