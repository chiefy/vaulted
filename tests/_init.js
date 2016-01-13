'use strict';
require('./helpers').should;

var
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert;

chai.use(helpers.cap);


describe('init', function() {
  var myVault;

  before(function() {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
    });
  });

  it('initialized false', function () {
    return myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.false;
    });
  });

  it('init successful', function () {
    return myVault.init().then(function (data) {
      assert.ok(data, 'token and keys should be returned');
      data.should.have.property('root_token');
      data.root_token.should.be.a('string');
      data.should.have.property('keys');
      data.keys.should.be.a('array');
      myVault.initialized.should.be.true;
      myVault.setToken(data.root_token);
      helpers.backup(data);
    });
  });

  it('init - already initialized', function () {
    return myVault.init().then(function (self) {
        self.initialized.should.be.true;
        self.token.should.not.be.null;
    });
  });

  it('initialized true', function () {
    return myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.true;
    });
  });

  it('#health: should reject with Error and statusCode 500 when not initialized or sealed', function () {
    return myVault.checkHealth().then(function (status) {
      debuglog('health status: ', status);
      assert.notOk(status, 'health status should not be returned');
    }).catch(function (err) {
      err.should.have.property('statusCode');
      err.statusCode.should.equal(500);
      err.should.have.property('error');
      debuglog(err.error);

      err.error.should.have.property('initialized');
      err.error.initialized.should.be.true;
      err.error.should.have.property('sealed');
      err.error.sealed.should.be.true;
      err.error.should.have.property('standby');
    });
  });

});