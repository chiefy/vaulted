var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

/**
  * @module policy
  * @extends Vaulted
  * @desc Provides implementation for the Vault Policy APIs
  *
 */

module.exports = function extend(Proto) {
  Vaulted.getPolicyEndpoint = _.partial(Proto.validateEndpoint, 'sys/policy/:id');
  _.extend(Proto, Vaulted);
};

/**
 * @method getPolicies
 * @desc Gets the list of policies for the vault and sets internal property accordingly
 *
 * @resolve {[Policy]} Resolves with list of policy.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getPolicies = Promise.method(function getPolicies() {
  return this.getPolicyEndpoint()
    .get({
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function gotPolicies(data) {
      this.policies = data.policies;
      return this.policies;
    });
});

/**
 * @method createPolicy
 * @desc Creates the specified policy in the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the policy
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.rules - the definition of the policy rules (HCL or json format)
 * @resolve {[Policy]} Resolves with list of policy.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createPolicy = Promise.method(function createPolicy(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide policy id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide policy details.'));
  }
  if (!_.isString(options.body.rules) || options.body.rules.length === 0) {
    return Promise.reject(new Error('You must provide policy rule as string.'));
  }

  return this.getPolicyEndpoint()
    .put({
      headers: this.headers,
      id: options.id,
      body: options.body
    })
    .promise()
    .bind(this)
    .then(this.getPolicies);
});

/**
 * @method deletePolicy
 * @desc Deletes the specified policy from the vault and sets internal property accordingly
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - unique identifier for the policy
 * @resolve {[Policy]} Resolves with list of policy.
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deletePolicy = Promise.method(function deletePolicy(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide policy id.'));
  }

  return this.getPolicyEndpoint()
    .delete({
      id: options.id,
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(this.getPolicies);
});
