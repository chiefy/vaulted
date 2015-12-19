var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module backend/consul
  * @extends Vaulted
  * @desc Provides implementation for the Vault Consul Secret backend APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getConsulRolesEndpoint = _.partial(Proto.validateEndpoint, 'consul/roles/:id');
  Vaulted.getConsulCredsEndpoint = _.partial(Proto.validateEndpoint, 'consul/creds/:id');
  Vaulted.getConsulAccessEndpoint = _.partial(Proto.validateEndpoint, 'consul/config/access');
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
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.configConsulAccess = Promise.method(function configConsulAccess(options) {
  options = options || {};
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide Consul configurations.'));
  }

  // the Vault API seems to allow an empty address vaule but that really does
  // not really make sense; so verify here.
  if (_.isUndefined(options.body.address) || !options.body.address) {
    return Promise.reject(new Error('You must provide Consul address (host:port).'));
  }

  if (_.isUndefined(options.body.token) || !options.body.token) {
    return Promise.reject(new Error('You must provide Consul management token.'));
  }

  return this.getConsulAccessEndpoint().post({
    headers: this.headers,
    body: options.body
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
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createConsulRole = Promise.method(function createConsulRole(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide Consul role id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide Consul role definition.'));
  }
  if (!_.isString(options.body.policy) && options.body.token_type !== 'management') {
    return Promise.reject(new Error('Consul role definition must be a string.'));
  }
  if (_.isString(options.body.policy)) {
    // According to documentation the policy must be base64 encoded; easier to handle this
    // here vs. each user having to do this manually.
    options.body.policy = new Buffer(options.body.policy).toString('base64');
  }

  return this.getConsulRolesEndpoint().post({
    headers: this.headers,
    id: options.id,
    body: options.body
  });
});

/**
 * @method getConsulRole
 * @desc Retrieve a specified Consul role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @resolve {Role} Consul role structure
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getConsulRole = Promise.method(function getConsulRole(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide Consul role id.'));
  }

  return this.getConsulRolesEndpoint().get({
    headers: this.headers,
    id: options.id
  });
});

/**
 * @method deleteConsulRole
 * @desc Removes a specified Consul role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteConsulRole = Promise.method(function deleteConsulRole(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide Consul role id.'));
  }

  return this.getConsulRolesEndpoint().delete({
    headers: this.headers,
    id: options.id
  });
});

/**
 * @method generateConsulRoleToken
 * @desc Generate a dynamic Consul token based on the role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the consul role
 * @resolve {Auth} Resolves with token details.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.generateConsulRoleToken = Promise.method(function generateConsulRoleToken(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide Consul role id.'));
  }

  return this.getConsulCredsEndpoint().get({
    headers: this.headers,
    id: options.id
  });
});
