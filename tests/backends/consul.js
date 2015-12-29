require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert;

var CONSUL_HOST = helpers.CONSUL_HOST + ':' + helpers.CONSUL_PORT;

chai.use(helpers.cap);


describe('consul', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      return myVault.mountConsul();
    });

  });

  describe('#configConsulAccess', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.configConsulAccess({
        body: {
          address: CONSUL_HOST,
          token: 'abcxyz'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('configure failed - no options', function () {
      return myVault.configConsulAccess()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('configure failed - no body', function () {
      return myVault.configConsulAccess({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('configure failed - missing address', function () {
      return myVault.configConsulAccess({
        body: {
          address: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('configure success - no token', function () {
      return myVault.configConsulAccess({
        body: {
          address: CONSUL_HOST
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('configure success - empty token', function () {
      return myVault.configConsulAccess({
        body: {
          address: CONSUL_HOST,
          token: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('configure success', function () {
      return helpers.createConsulToken().then(function (token) {
        assert.ok(token, 'token should be defined and not null');
        debuglog('configuring access to Consul secret backend: ', CONSUL_HOST);
        return myVault.configConsulAccess({
          body: {
            address: CONSUL_HOST,
            token: token
          }
        }).should.be.fulfilled;
      });
    });

  });

  describe('#createConsulRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
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
        .should.be.rejectedWith(/requires an id/);
    });

    it('create role failed - empty id', function () {
      return myVault.createConsulRole({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('create role failed - no body', function () {
      return myVault.createConsulRole({
        id: 'sample'
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('create role failed - body empty', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('create role failed - no policy', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: {
          policy: null
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('create role failed - no policy and token_type client', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: {
          token_type: 'client'
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('create role success - no policy and token_type management', function () {
      return myVault.createConsulRole({
        id: 'sample',
        body: {
          token_type: 'management'
        }
      }).should.be.fulfilled;
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
      return newVault.getConsulRole({
        id: 'readonly'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('get role - no options', function () {
      return myVault.getConsulRole()
        .should.be.rejectedWith(/requires an id/);
    });

    it('get role - id empty', function () {
      return myVault.getConsulRole({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
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
      return newVault.deleteConsulRole({
        id: 'fakeRole'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('delete role - no options', function () {
      return myVault.deleteConsulRole()
        .should.be.rejectedWith(/requires an id/);
    });

    it('delete role - empty id', function () {
      return myVault.deleteConsulRole({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
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
      return newVault.generateConsulRoleToken({
        id: 'readonly'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('generate token - no options', function () {
      return myVault.generateConsulRoleToken()
        .should.be.rejectedWith(/requires an id/);
    });

    it('generate token - empty id', function () {
      return myVault.generateConsulRoleToken({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
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

    it('generate token - readonly', function () {
      return myVault.generateConsulRoleToken({
        id: 'readonly'
      }).then(function (role) {
        debuglog('generated token: ', role);
        role.should.have.property('data');
        role.data.should.have.property('token');
        role.data.token.should.be.a('string');
      }).catch(function (err) {
        // several pre-conditions must happen for this to work so if a missing
        // setup item is forgotten then this could fail so this will help in
        // debugging the issue but still fail if promise rejected.
        debuglog('generate token error: ', err);
        assert.notOk(err, 'err should be undefined');
      });
    });

  });

  after(function () {
    return myVault.deleteConsulRole({
      id: 'sample'
    }).then(function () {
      return myVault.deleteMount({
        id: 'consul'
      });
    });
  });

});
