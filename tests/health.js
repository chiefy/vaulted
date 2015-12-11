require('./helpers').should;

var
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert;

chai.use(helpers.cap);


describe('health', function() {
  var myVault;

  before(function() {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
    });
  });

  it('should reject with Error and statusCode 500 when not initialized or sealed', function () {
    return myVault.checkHealth().then(function (status) {
      debuglog('health status: ', status);
      assert.notOk(status, 'health status should not be returned');
    }).catch(function (err) {
      debuglog(err);
      err.should.have.property('statusCode');
      err.statusCode.should.equal(500);
      err.should.have.property('error');
      err.error.should.have.property('initialized');
      // could be true or false depending what tests get executed before this one
      // so to make sure it is consistent this line is being commented out.
      // there is no way to "uninitialize" a vault.
      // err.error.initialized.should.be.true;
      err.error.should.have.property('sealed');
      err.error.sealed.should.be.true;
      err.error.should.have.property('standby');
    });
  });

  describe('#unsealed vault tests', function () {

    beforeEach(function () {
      return myVault.init().bind(myVault).then(myVault.unSeal).catch(function (err) {
        debuglog('failed to initialize and unseal vault: %s', err.error || err.message);
      });
    });

    // need a standby instance to properly test
    it.skip('should reject with Error and statusCode 429 when unsealed and standby (standbyok false)', function () {
      return myVault.checkHealth().then(function (status) {
        debuglog('health status: ', status);
        assert.ok(status, 'status should be defined');
        status.should.have.property('initialized');
        status.initialized.should.be.true;
        status.should.have.property('sealed');
        status.sealed.should.be.false;
        status.should.have.property('standby');
        status.standby.should.be.true;
      });
      // .catch(function (err) {
      //   debuglog(err);
      //   assert.notOk(err, 'should be successful and not have failed');
      //   err.should.be.an.instanceof(Error);
      //   err.should.have.property('statusCode');
      //   err.statusCode.should.equal(429);
      //   err.should.have.property('error');
      //   err.error.should.have.property('initialized');
      //   err.error.initialized.should.be.true;
      //   err.error.should.have.property('sealed');
      //   err.error.sealed.should.be.false;
      //   err.error.should.have.property('standby');
      //   err.error.standby.should.be.true;
      // });

    });

    it('should resolve with health details if initialized and unsealed and active', function () {
      return myVault.checkHealth().then(function (status) {
        debuglog('health status: ', status);
        assert.ok(status, 'status should be defined');
        status.should.have.property('initialized');
        status.initialized.should.be.true;
        status.should.have.property('sealed');
        status.sealed.should.be.false;
        status.should.have.property('standby');
        status.standby.should.be.false;
      });
    });

    it('should resolve with health details if initialized and unsealed and standbyok true', function () {
      return myVault.checkHealth({standbyok: true}).then(function (status) {
        debuglog('health status: ', status);
        assert.ok(status, 'status should be defined');
        status.should.have.property('initialized');
        status.initialized.should.be.true;
        status.should.have.property('sealed');
        status.sealed.should.be.false;
        status.should.have.property('standby');
        status.standby.should.be.false;
      });
    });

  });

  after(function () {
    if (!myVault.status.sealed) {
      return helpers.resealVault(myVault);
    }
  });

});
