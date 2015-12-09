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


describe('auths', function () {
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

  describe('#getAuthMounts', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.getAuthMounts().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should update internal state with list of auth mounts', function () {
      var existingAuthMounts = _.cloneDeep(myVault.auths);
      return myVault.getAuthMounts().then(function (auths) {
        existingAuthMounts.should.be.empty;
        existingAuthMounts.should.not.contain.keys('token/');
        auths.should.not.be.empty;
        auths.should.contain.keys('token/');
      });
    });

  });

  describe('#createAuthMount', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.createAuthMount({
        id: 'other',
        body: {
          type: 'app-id'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.createAuthMount().then(function (auths) {
        debuglog('createAuthMount successful (should fail)', auths);
        assert.notOk(auths, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount id.');
      });
    });

    it('should reject with an Error if option id empty', function () {
      return myVault.createAuthMount({
        id: ''
      }).then(function (auths) {
        debuglog('createAuthMount successful (should fail)', auths);
        assert.notOk(auths, 'no mount id successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount id.');
      });
    });

    it('should reject with an Error if option body empty', function () {
      return myVault.createAuthMount({
        id: 'xzy',
        body: null
      }).then(function (auths) {
        debuglog('createAuthMount successful (should fail)', auths);
        assert.notOk(auths, 'no mount body successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount details.');
      });
    });

    it('should reject with an Error if option body without type', function () {
      return myVault.createAuthMount({
        id: 'xzy',
        body: {}
      }).then(function (auths) {
        debuglog('createAuthMount successful (should fail)', auths);
        assert.notOk(auths, 'no mount body successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount type.');
      });
    });

    it('should reject with an Error if option body with empty type', function () {
      return myVault.createAuthMount({
        id: 'xzy',
        body: {
          type: ''
        }
      }).then(function (auths) {
        debuglog('createAuthMount successful (should fail)', auths);
        assert.notOk(auths, 'no mount body type successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount type.');
      });
    });

    it('should resolve to updated list of auths', function () {
      var existingAuthMounts = _.cloneDeep(myVault.auths);
      return myVault.createAuthMount({
        id: 'other',
        body: {
          type: 'app-id'
        }
      }).then(function (auths) {
        existingAuthMounts.should.not.be.empty;
        existingAuthMounts.should.not.contain.keys('other/');
        auths.should.not.be.empty;
        auths.should.contain.keys('other/');
      });
    });

  });


  describe('#deleteAuthMount', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.deleteAuthMount({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject if no options provided', function () {
      return myVault.deleteAuthMount().then(function (self) {
        debuglog('deleteAuthMount successful (should fail)', self);
        assert.notOk(self, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount id.');
      });
    });

    it('should reject if no option id provided', function () {
      return myVault.deleteAuthMount({
        id: ''
      }).then(function (self) {
        debuglog('deleteAuthMount successful (should fail)', self);
        assert.notOk(self, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide auth mount id.');
      });
    });

    it('should resolve to updated instance with mount removed', function () {
      var existingAuthMounts = _.cloneDeep(myVault.auths);
      return myVault.deleteAuthMount({
        id: 'other'
      }).then(function (auths) {
        existingAuthMounts.should.not.be.empty;
        existingAuthMounts.should.contain.keys('other/');
        auths.should.not.be.empty;
        auths.should.not.contain.keys('other/');
        auths.should.contain.keys('token/');
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
