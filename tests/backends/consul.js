require('../helpers.js').should;

var
  helpers = require('../helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  chai = helpers.chai,
  assert = helpers.assert,
  Vault = require('../../lib/vaulted');

var CONSUL_HOST = helpers.CONSUL_HOST + ':' + helpers.CONSUL_PORT;
var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;

chai.use(helpers.cap);


describe('consul', function () {
  var myVault = null;

  before(function () {

    myVault = new Vault({
      // debug: 1,
      vault_host: VAULT_HOST,
      vault_port: VAULT_PORT,
      vault_ssl: 0
    });

    return myVault.prepare().bind(myVault)
      .then(myVault.init)
      .then(myVault.unSeal)
      .then(function createMount() {
        return myVault.createMount({
          id: 'consul',
          body: {
            type: 'consul'
          }
        });
      })
      .catch(function onError(err) {
        debuglog('(before) vault setup of consul backend failed: %s', err.message);
      });

  });

  describe('#configConsulAccess', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.configConsulAccess({
        body: {
          address: CONSUL_HOST
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('configure failed - no options', function () {
      return myVault.configConsulAccess()
        .should.be.rejectedWith(/You must provide Consul configurations/);
    });

    it('configure failed - no body', function () {
      return myVault.configConsulAccess({})
        .should.be.rejectedWith(/You must provide Consul configurations/);
    });

    it('configure failed - missing address', function () {
      return myVault.configConsulAccess({
        body: {
          address: ''
        }
      }).should.be.rejectedWith(/You must provide Consul address/);
    });

    it('configure success - no token (defaulted)', function () {
      return myVault.configConsulAccess({
        body: {
          address: CONSUL_HOST
        }
      }).should.be.fulfilled;
    });

    it('configure success - empty token (defaulted)', function () {
      return myVault.configConsulAccess({
        body: {
          address: CONSUL_HOST,
          token: ''
        }
      }).should.be.fulfilled;
    });

    it('configure success - with token supplied', function () {
      return myVault.configConsulAccess({
        body: {
          address: CONSUL_HOST,
          token: myVault.token
        }
      }).should.be.fulfilled;
    });

  });

  describe('#createConsulRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      var policy = 'key "" { policy = "read" }';
      return newVault.createConsulRole({
        id: 'readonly',
        body: {
          policy: policy
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('create role failed - no options', function () {
      return myVault.createConsulRole()
        .should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('create role failed - empty id', function () {
      return myVault.createConsulRole({
        id: ''
      }).should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('create role failed - no body', function () {
      return myVault.createConsulRole({
        id: 'sample'
      }).should.be.rejectedWith(/You must provide Consul role definition/);
    });

    it('create role failed - body empty', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: null
      }).should.be.rejectedWith(/You must provide Consul role definition/);
    });

    it('create role failed - no policy', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: {
          policy: null
        }
      }).should.be.rejectedWith(/Consul role definition must be a string/);
    });

    it('create role failed - policy not string', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: {
          policy: {}
        }
      }).should.be.rejectedWith(/Consul role definition must be a string/);
    });

    it('create role success', function () {
      var policy = 'key "" { policy = "read" }';
      return myVault.createConsulRole({
        id: 'readonly',
        body: {
          policy: policy
        }
      }).should.be.fulfilled;
    });

  });

  describe('#getConsulRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.getConsulRole({
        id: 'readonly'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('get role - no options', function () {
      return myVault.getConsulRole()
        .should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('get role - id empty', function () {
      return myVault.getConsulRole({
        id: ''
      }).should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('get role - not found', function () {
      return myVault.getConsulRole({
        id: 'fakeRole'
      }).then(function () {
        assert.notOk(true, 'get role successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.should.have.property('statusCode');
        err.statusCode.should.equal(404);
      });
    });

    it('get role - readonly', function () {
      return myVault.getConsulRole({
        id: 'readonly'
      }).then(function (role) {
        role.should.have.property('data');
        role.data.should.have.property('policy');
        role.data.policy.should.be.a('string');
        debuglog('readonly role: %s', role.data.policy);
        debuglog(new Buffer(role.data.policy, 'base64').toString('ascii'));
      });
    });

  });

  describe('#deleteConsulRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.deleteConsulRole({
        id: 'fakeRole'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('delete role - no options', function () {
      return myVault.deleteConsulRole()
        .should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('delete role - empty id', function () {
      return myVault.deleteConsulRole({
        id: ''
      }).should.be.rejectedWith(/You must provide Consul role id/);
    });

    // the Vault API seems to always return 204 whether the specified
    // item exists or not. skip the test for now.
    it.skip('delete role - not found', function () {
      return myVault.deleteConsulRole({
        id: 'fakeRole'
      }).then(function () {
        assert.notOk(true, 'delete role successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.should.have.property('statusCode');
        err.statusCode.should.equal(404);
      });
    });

    it('delete role successful', function () {
      var policy = 'key "" { policy = "write" }';
      return myVault.createConsulRole({
        id: 'writer',
        body: {
          policy: policy
        }
      }).then(function () {
        return myVault.deleteConsulRole({
          id: 'writer'
        }).should.be.fulfilled;
      });
    });

  });

  describe('#generateConsulRoleToken', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.generateConsulRoleToken({
        id: 'readonly'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('generate token - no options', function () {
      return myVault.generateConsulRoleToken()
        .should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('generate token - empty id', function () {
      return myVault.generateConsulRoleToken({
        id: ''
      }).should.be.rejectedWith(/You must provide Consul role id/);
    });

    it('generate token - not found', function () {
      return myVault.generateConsulRoleToken({
        id: 'fakeRole'
      }).then(function () {
        assert.notOk(true, 'generate token successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.should.have.property('statusCode');
        err.statusCode.should.equal(400);
      });
    });

    // WIP; not sure why it is not currently working
    it.skip('generate token - readonly', function () {
      return myVault.generateConsulRoleToken({
        id: 'readonly'
      }).then(function (role) {
        role.should.have.property('data');
        role.data.should.have.property('token');
        role.data.token.should.be.a('string');
      }).then(null, function (err) {
        debuglog(err.error);
        err.should.be.undefined;
      });
    });

  });

  after(function () {
    return myVault.deleteMount({
      id: 'consul'
    }).then(function () {
      if (!myVault.status.sealed) {
        return myVault.seal().then(function () {
          debuglog('vault sealed: %s', myVault.status.sealed);
        }).then(null, function (err) {
          debuglog(err);
          debuglog('failed to seal vault: %s', err.message);
        });
      }
    }).then(null, function (err) {
      debuglog(err);
      debuglog('failed to remove consul mount: %s', err.message);
    });
  });

});
