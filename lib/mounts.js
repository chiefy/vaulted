var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id');
  _.extend(Proto, Vaulted);
};

Vaulted.getMounts = function getMounts() {
  return this.getMountsEndpoint()
    .get({
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function gotMounts(mounts) {
      this.mounts = mounts;
      return this.mounts;
    });
};

Vaulted.deleteMount = function deleteMount(options) {
  options = options || {};
  return this.getMountsEndpoint()
    .delete({
      id: options.id,
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function deletedMount() {
      delete this.mounts[options.id];
      return this;
    });
};

Vaulted.createMount = function createMount(options) {
  options = options || {};

  return this.getMountsEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    })
    .promise()
    .bind(this)
    .then(function createdMount() {
      this.mounts[options.id] =  {
        type: options.type,
        descripton: options.description
      };
      return options;
    });
};

