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
  options = options || { body: null, id: null };
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
      this.mounts[options.id+'/'] = new_mount;
      return this.mounts;
    });
};

Vaulted.reMount = function reMount(options) {
  options = options || {};
  var
    to_mount = options.to,
    from_mount;

  try {
    if( _.isUndefined(to_mount) || to_mount.length === 0) {
      throw new Error('No "to" parameter sent');
    }
    if(_.isUndefined(options.from) || options.from.length === 0) {
      throw new Error('No "from" parameter sent');
    }
    from_mount = this.mounts[options.from + '/'];
    if(_.isUndefined(from_mount)) {
      throw new Error();
    }
  } catch(ex) {
    return Promise.reject(new Error('Could not find existing mount named: ' + options.from));
  }
  return this.getRemountEndpoint()
    .post({
      headers: this.headers,
      body: {
        from: options.from,
        to: to_mount
      }
    })
    .promise()
    .bind(this)
    .then(function remounted() {
      var from = options.from + '/';
      this.mounts[to_mount + '/'] = this.mounts[from];
      delete this.mounts[from];
      return this.mounts;
    });
};


