'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('cubbyhole', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });

  });

  describe('#writeCubby', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.writeCubby({
        id: 'sample',
        body: {
          value: 'dummy'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.writeCubby().should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.writeCubby({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('secret written', function () {
      return myVault.writeCubby({
        id: 'sample',
        body: {
          value: 'dummy'
        }
      }).should.be.fulfilled;
    });

  });

  describe('#readCubby', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.readCubby({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.readCubby().should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.readCubby({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('secret not found', function () {
      return myVault.readCubby({
        id: 'fake'
      }).then(function (secret) {
        debuglog('secret: %s', secret);
        assert.notOk(secret, 'get secret successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.should.have.property('statusCode');
        err.statusCode.should.equal(404);
      });
    });

    it('secret returned', function () {
      return myVault.readCubby({
        id: 'sample'
      }).then(function (secret) {
        secret.should.not.be.undefined;
        secret.data.value.should.be.equal('dummy');
      }).then(null, function (err) {
        debuglog(err);
        expect(err).to.be.undefined;
      });
    });

  });

  describe('#deleteCubby', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deleteCubby({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.deleteCubby()
        .should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.deleteCubby({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('secret deleted', function () {
      return myVault.deleteCubby({
        id: 'sample'
      }).should.be.fulfilled;
    });

  });

});
