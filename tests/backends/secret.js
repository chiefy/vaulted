'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('secret', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });

  });

  describe('#write', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.write({
        id: 'sample',
        body: {
          value: 'dummy'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.write().should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.write({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('secret written', function () {
      return myVault.write({
        id: 'sample',
        body: {
          value: 'dummy'
        }
      }).should.be.fulfilled;
    });

  });

  describe('#read', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.read({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.read().should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.read({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('secret not found', function () {
      return myVault.read({
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
      return myVault.read({
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

  describe('#delete', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.delete({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.delete()
        .should.be.rejectedWith(/requires an id/);
    });

    it('empty secret id provided', function () {
      return myVault.delete({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it.skip('secret not deleted', function () {
      return myVault.delete({
        id: 'fake'
      }).then(function () {
        debuglog('delete should fail but was successful');
        assert.notOk(true, 'delete secret successful!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
      });
    });

    it('secret deleted', function () {
      return myVault.delete({
        id: 'sample'
      }).should.be.fulfilled;
    });

  });

});
