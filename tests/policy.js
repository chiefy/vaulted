require('./helpers').should;

var
  helpers = require('./helpers'),
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
      return myVault.getPolicies().then(function (policies) {
        debuglog(policies);
        policies.should.not.be.empty;
        policies.should.contain('root');
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
        .should.be.rejectedWith(/You must provide policy id/);
    });

    it('should reject with an Error if option id empty', function () {
      return myVault.createPolicy({
        id: ''
      }).should.be.rejectedWith(/You must provide policy id/);
    });

    it('should reject with an Error if option body empty', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: null
      }).should.be.rejectedWith(/You must provide policy details/);
    });

    it('should reject with an Error if option body without rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {}
      }).should.be.rejectedWith(/You must provide policy rule as string/);
    });

    it('should reject with an Error if option body with empty rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {
          rules: ''
        }
      }).should.be.rejectedWith(/You must provide policy rule as string/);
    });

    it('should reject with an Error if rule not string', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {
          rules: {}
        }
      }).should.be.rejectedWith(/You must provide policy rule as string/);
    });

    it('should resolve to updated list of policies', function () {
      var existingPolicies = _.cloneDeep(myVault.policies);
      var policy = 'path "secret/foo" { policy = "read" }';
      return myVault.createPolicy({
        id: 'other',
        body: {
          rules: policy
        }
      }).then(function (policies) {
        debuglog(policies);
        existingPolicies.should.not.be.empty;
        policies.should.not.be.empty;
        existingPolicies.should.not.contain('other');
        policies.should.contain('other');
      }).catch(function (err) {
        debuglog(err);
        expect(err).to.be.undefined;
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
      return myVault.deletePolicy().should.be.rejectedWith(/You must provide policy id/);
    });

    it('should reject if no option id provided', function () {
      return myVault.deletePolicy({}).should.be.rejectedWith(/You must provide policy id/);
    });

    it('should resolve to updated instance with policy removed', function () {
      var existingPolicies = _.cloneDeep(myVault.policies);
      return myVault.deletePolicy({
        id: 'other'
      }).then(function (policies) {
        debuglog(policies);
        existingPolicies.should.not.be.empty;
        policies.should.not.be.empty;
        existingPolicies.should.contain('other');
        policies.should.not.contain('other');
        policies.should.contain('root');
      });
    });

  });

});
