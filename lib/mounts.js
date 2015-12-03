var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function extend(Proto) {
  Vaulted.getMountsEndpoint = _.partial(Proto.validateEndpoint, 'sys/mounts/:id');
  Vaulted.getRemountEndpoint = _.partial(Proto.validateEndpoint, 'sys/remount');
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
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide mount id.'));
  }

  return this.getMountsEndpoint()
    .delete({
      id: options.id,
      headers: this.headers
    })
    .promise()
    .bind(this)
    .then(function deletedMount() {
      delete this.mounts[options.id + '/'];
      return this;
    });
};

Vaulted.createMount = function createMount(options) {
  options = options || {};
  if (_.isUndefined(options.id) || !options.id) {
    return Promise.reject(new Error('You must provide mount id.'));
  }

  if (_.isUndefined(options.body) || !options.body) {
    return Promise.reject(new Error('You must provide mount details.'));
  }

  if (_.isUndefined(options.body.type) || !options.body.type) {
    return Promise.reject(new Error('You must provide mount type.'));
  }

  var new_mount = {
    type: options.body.type,
    description: options.body.description
  };
  return this.getMountsEndpoint()
    .post({
      headers: this.headers,
      id: options.id,
      body: new_mount
    })
    .promise()
    .bind(this)
    .then(function createdMount() {
      this.mounts[options.id + '/'] = new_mount;
      return this.mounts;
    });
};

Vaulted.reMount = function reMount(options) {
  options = options || {};
  if(_.isUndefined(options.from) || !options.from) {
    return Promise.reject(new Error('You must provide from mount.'));
  }

  if(_.isUndefined(options.to) || !options.to) {
    return Promise.reject(new Error('You must provide to mount.'));
  }

  if(_.isUndefined(this.mounts[options.from + '/'])) {
    return Promise.reject(new Error('Could not find existing mount named: ' + options.from));
  }

  return this.getRemountEndpoint()
    .post({
      headers: this.headers,
      body: options
    })
    .promise()
    .bind(this)
    .then(function remounted() {
      this.mounts[options.to + '/'] = this.mounts[options.from + '/'];
      delete this.mounts[options.from + '/'];
      return this.mounts;
    });
};


