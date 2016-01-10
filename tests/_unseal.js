'use strict';
require('./helpers').should;

var
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert;

chai.use(helpers.cap);


describe('seal', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;
  var myKeys;

  before(function () {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
      myKeys = helpers.recover().keys;
    });
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

    it('should resolve to binded instance - success still sealed', function () {
      return myVault.unSeal({body: {key: myKeys[0]}}).then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

    it('should resolve to binded instance - success unsealed', function () {
      return myVault.unSeal({body: {key: myKeys[1]}}).then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    // need a standby instance to properly test
    it('#health: should reject with Error and statusCode 429 when unsealed and standby (standbyok false)', function () {
      return myVault.checkHealth({
          standbyok: false
        }).then(function (status) {
          debuglog('health status: ', status);
          assert.ok(status, 'status should be defined');
          status.should.have.property('initialized');
          status.initialized.should.be.true;
          status.should.have.property('sealed');
          status.sealed.should.be.false;
          status.should.have.property('standby');
          // status.standby.should.be.true;
        })
        .catch(function (err) {
          err.should.have.property('statusCode');
          err.statusCode.should.equal(429);
          err.should.have.property('error');
          debuglog(err.error);
          err.error.should.have.property('initialized');
          err.error.initialized.should.be.true;
          err.error.should.have.property('sealed');
          err.error.sealed.should.be.false;
          err.error.should.have.property('standby');
          err.error.standby.should.be.true;
        });

    });

    it('should resolve to binded instance - already unsealed', function () {
      return myVault.unSeal().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    it('should be rejected with Error - not initialized', function () {
      return newVault.unSeal().should.be.rejectedWith(/Vault has not been initialized/);
    });

  });

  after(function (done) {
    this.timeout(5000);
    helpers.isVaultReady(myVault).then(function () {
      done();
    }).catch(function onError(err) {
      debuglog('Vault NOT Ready: ', err);
      done(err);
    });
  });

});
