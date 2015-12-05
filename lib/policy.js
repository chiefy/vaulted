var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getPolicyEndpoint = _.partial(Proto.validateEndpoint, 'sys/policy/:id');
  _.extend(Proto, Vaulted);
};

/**
 * Gets the list of policies for the vault and sets internal property accordingly
 *
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'policies' property updated.
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
 * Creates the specified policy in the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, keys "id" and "body" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'policies' property updated.
 */
Vaulted.createPolicy = Promise.method(function createPolicy(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide policy id.'));
  }
  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide policy details.'));
  }
  if (!_.isString(options.body.rule) || options.body.rule.length === 0) {
    return Promise.reject(new Error('You must provide policy rule as string.'));
  }
  // According to documentation the policy must be base64 encoded; easier to handle this
  // here vs. each user having to do this manually.
  options.body.rule = new Buffer(options.body.rule).toString('base64');

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
 * Deletes the specified policy from the vault and sets internal property accordingly
 *
 * @param  {Object} options Hash of options to send to API request, key "id" required.
 * @return {Promise<Vaulted>} Promise which is resolved with current instance of Vaulted
 * with 'policies' property updated.
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
