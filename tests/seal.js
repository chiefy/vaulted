require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  _ = require('lodash'),
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect,
  Vault = require('../lib/vaulted');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;


describe('seal', function () {
  var myVault;

  before(function () {
    myVault = new Vault({
      // debug: 1,
      vault_host: VAULT_HOST,
      vault_port: VAULT_PORT,
      vault_ssl: 0
    });

    return myVault.prepare();
  });

  describe('#getSealedStatus', function () {

    it('should resolve to binded instance - success', function () {
      return myVault.getSealedStatus().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

  });

  describe('#unSeal', function () {

    it('should resolve to binded instance - success', function () {
      return myVault.unSeal().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    it('should resolve to binded instance - already unsealed', function () {
      return myVault.unSeal().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    it('should be rejected with Error - not initialized', function () {
      myVault.initialized = false;
      return myVault.unSeal().should.be.rejectedWith(/Vault has not been initialized/);
    });

  });

  describe('#seal', function () {

    it('should be rejected with Error - not initialized', function () {
      myVault.initialized = false;
      return myVault.seal().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve to binded instance - success', function () {
      var existing = _.cloneDeep(myVault.status);
      myVault.initialized = true;
      return myVault.seal().then(function (self) {
        existing.should.have.property('sealed');
        existing.sealed.should.be.false;
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

    it('should resolve to binded instance - already sealed', function () {
      var existing = _.cloneDeep(myVault.status);
      myVault.initialized = true;
      return myVault.seal().then(function (self) {
        existing.should.have.property('sealed');
        existing.sealed.should.be.true;
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
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
