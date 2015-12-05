require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  _ = require('lodash'),
  chai = helpers.chai,
  assert = helpers.assert,
  Vault = require('../lib/vaulted');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;


describe('policy', function () {
  var myVault;

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
      .catch(function onError(err) {
        debuglog('(before) vault setup failed: %s', err.message);
      });

  });

  describe('#getPolicies', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.getPolicies().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve to updated list of policies', function () {
      var existingPolicies = _.cloneDeep(myVault.policies);
      return myVault.getPolicies().then(function (policies) {
        existingPolicies.should.be.empty;
        policies.should.not.be.empty;
        existingPolicies.should.not.contain('root');
        policies.should.contain('root');
      });
    })

  });

  describe('#createPolicy', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      var policy = 'key "" { policy = "read" }';
      return newVault.createPolicy({
        id: 'other',
        body: {
          rule: policy
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.createPolicy().then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy id.');
      });
    });

    it('should reject with an Error if option id empty', function () {
      return myVault.createPolicy({
        id: ''
      }).then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy id.');
      });
    });

    it('should reject with an Error if option body empty', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: null
      }).then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy details.');
      });
    });

    it('should reject with an Error if option body without rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {}
      }).then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy rule as string.');
      });
    });

    it('should reject with an Error if option body with empty rule', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {
          rule: ''
        }
      }).then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy rule as string.');
      });
    });

    it('should reject with an Error if rule not string', function () {
      return myVault.createPolicy({
        id: 'xyz',
        body: {
          rule: {}
        }
      }).then(function (policies) {
        debuglog('createPolicy successful (should fail)', policies);
        assert.notOk(policies, 'no policy details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide policy rule as string.');
      });
    });

    it('should resolve to updated list of policies', function () {
      var existingPolicies = _.cloneDeep(myVault.policies);
      var policy = 'key "" { policy = "read" }';
      return myVault.createPolicy({
        id: 'other',
        body: {
          rule: policy
        }
      }).then(function (policies) {
        existingPolicies.should.not.be.empty;
        policies.should.not.be.empty;
        existingPolicies.should.not.contain('other');
        policies.should.contain('other');
      });
    });

  });

  describe('#deletePolicy', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
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
        existingPolicies.should.not.be.empty;
        policies.should.not.be.empty;
        existingPolicies.should.contain('other');
        policies.should.not.contain('other');
        policies.should.contain('root');
      });
    });

  });

  after(function () {
    if (!myVault.status.sealed) {
      return myVault.seal().then(function () {
        debuglog('vault sealed: %s', myVault.status.sealed);
      }).then(null, function (err) {
        debuglog(err);
        debuglog('failed to seal vault: %s', err.message);
      });
    }
  });

});
