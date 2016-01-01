require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert;

chai.use(helpers.cap);


describe('health', function () {
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });
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
    return myVault.checkHealth({
      standbyok: true
    }).then(function (status) {
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
