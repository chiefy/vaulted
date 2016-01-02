'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  _ = require('lodash'),
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('keys', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });

  });

  describe('#getKeyStatus', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getKeyStatus().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with current key status', function () {
      return myVault.getKeyStatus().then(function (status) {
        expect(status).to.not.be.undefined;
        status.should.have.property('term');
        status.term.should.be.ok;
        status.should.have.property('install_time');
        status.install_time.should.be.ok;
      });
    });

  });

  describe('#getRekeyStatus', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getRekeyStatus().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with rekey status', function () {
      return myVault.getRekeyStatus().then(function (status) {
        debuglog(status);
        expect(status).to.not.be.undefined;
        status.should.have.property('started');
        status.started.should.be.exist;
        status.should.have.property('t');
        status.t.should.be.exist;
        status.should.have.property('n');
        status.n.should.be.exist;
        status.should.have.property('progress');
        status.progress.should.be.exist;
        status.should.have.property('required');
        status.required.should.be.exist;
      });
    });

  });

  describe('#startRekey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.startRekey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve', function () {
      return myVault.startRekey().should.be.resolved;
    });

  });

  describe('#updateRekey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.updateRekey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with instance of binded Vault', function () {
      var existingKeys = _.cloneDeep(myVault.keys);
      return myVault.updateRekey().then(function (vault) {
        vault.keys.should.not.be.empty;
        vault.keys.should.not.include.members(existingKeys);
      });
    });

  });

  describe('#stopRekey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.stopRekey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve even if no rekey in progress', function () {
      return myVault.stopRekey().should.be.resolved;
    });

    it('should resolve', function () {
      return myVault.startRekey().bind(myVault)
        .then(myVault.stopRekey).should.be.resolved;
    });

  });

  describe('#rotateKey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.rotateKey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve', function () {
      return myVault.rotateKey().should.be.resolved;
    });

  });

});
