'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('keys', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;
  var myKeys;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      myKeys = helpers.recover().keys;
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
        status.should.have.property('nonce');
        status.nonce.should.be.exist;
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

    it('should resolve with instance of binded Vault - complete false', function () {

      return myVault.getRekeyStatus()
        .then(function(status) {
          return myVault.updateRekey({
            body: {
              key: myKeys[0],
              nonce: status.nonce
            }
          }).then(function (data) {
            data.complete.should.be.false;
          });
        });

    });

    it('should resolve with instance of binded Vault - complete true', function () {

      return myVault.getRekeyStatus()
        .then(function(status) {
          return myVault.updateRekey({
            body: {
              key: myKeys[1],
              nonce: status.nonce
            }
          }).then(function (data) {
            data.complete.should.be.true;
          });
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
