require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  _ = require('lodash'),
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect,
  Vault = require('../lib/vaulted.js');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;

describe('keys', function () {
  var myVault = null;

  before(function () {
    myVault = new Vault({
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

  describe('#getKeyStatus', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
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
      var newVault = new Vault({});
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
      var newVault = new Vault({});
      return newVault.startRekey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve', function () {
      return myVault.startRekey().should.be.resolved;
    });

  });

  describe('#updateRekey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.updateRekey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with instance of binded Vault', function () {
      var existingKeys = _.cloneDeep(myVault.keys);
      return myVault.updateRekey().then(function (vault) {
        vault.should.be.an.instanceof(Vault);
        vault.keys.should.not.be.empty;
        vault.keys.should.not.include.members(existingKeys);
      });
    });

  });

  describe('#stopRekey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
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
      var newVault = new Vault({});
      return newVault.rotateKey().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve', function () {
      return myVault.rotateKey().should.be.resolved;
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
