require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  _ = require('lodash'),
  expect = helpers.expect,
  chai = helpers.chai;

chai.use(helpers.cap);


describe('policy', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });

  });

  describe('#getPolicies', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getPolicies().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve to updated list of policies', function () {
      return myVault.getPolicies().then(function (data) {
        debuglog(data);
        data.policies.should.not.be.empty;
        data.policies.should.contain('root');
      });
    });

  });

  describe('#createPolicy', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var policy = 'path "secret/foo" { policy = "read" }';
      return newVault.createPolicy({
        id: 'other',
        body: {
          rules: policy
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.createPolicy()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if option id empty', function () {
      return myVault.createPolicy({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if option body empty', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if option body without rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if option body with empty rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {
          rules: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve to updated list of policies', function () {
      var policy = 'path "secret/foo" { policy = "read" }';
      return myVault.createPolicy({
        id: 'other',
        body: {
          rules: policy
        }
      }).should.be.resolved;
    });

    it('should resolve to updated list of policies - using js objects', function () {
      var policy = {
        "path": {
          "secret/*": {
            "policy": "write"
          }
        }
      };
      return myVault.createPolicy({
        id: 'jsother',
        body: {
          rules: policy
        }
      }).then(function () {
        return myVault.getPolicies().then(function (data) {
          debuglog(data);
          data.policies.should.not.be.empty;
          data.policies.should.contain('jsother');
        });
      }).finally(function () {
        return myVault.deletePolicy({
          id: 'jsother'
        });
      });
    });

  });

  describe('#getPolicy', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getPolicy({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject if no options provided', function () {
      return myVault.getPolicy().should.be.rejectedWith(/requires an id/);
    });

    it('should reject if no option id provided', function () {
      return myVault.getPolicy({}).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve to instance of policy', function () {
      return myVault.getPolicy({
        id: 'other'
      }).then(function (policy) {
        debuglog(policy);
        policy.should.not.be.undefined;
        policy.should.have.property('name');
        policy.name.should.be.equal('other');
      });
    });

  });

  describe('#deletePolicy', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deletePolicy({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject if no options provided', function () {
      return myVault.deletePolicy().should.be.rejectedWith(/requires an id/);
    });

    it('should reject if no option id provided', function () {
      return myVault.deletePolicy({}).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve to updated instance with policy removed', function () {
      var existingPolicies = _.cloneDeep(myVault.policies);
      return myVault.deletePolicy({
        id: 'other'
      }).should.be.resolved;
    });

  });

});
