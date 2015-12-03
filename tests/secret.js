require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect,
  Vault = require('../lib/vaulted');

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;

chai.use(helpers.cap);


describe('secret', function () {
  var myVault;

  before(function () {
    myVault = new Vault({
      // debug: 1,
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

  describe('#write', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.write({
        id: 'sample',
        body: {
          value: 'dummy'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.write().then(function () {
        debuglog('write secret successful (should fail)');
        assert.notOk(true, 'no secret id successfully created!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
    });

    it('empty secret id provided', function () {
      return myVault.write({id: ''}).then(function () {
        debuglog('write secret successful (should fail)');
        assert.notOk(true, 'no secret id successfully created!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
    });

    it('no secret provided', function () {
      return myVault.write({id: 'dummy'}).then(function () {
        debuglog('write secret successful (should fail)');
        assert.notOk(true, 'no secret body successfully created!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide an secret to write to the Vault.');
      });
    });

    it('empty secret provided', function () {
      return myVault.write({id: 'dummy', body: null}).then(function () {
        debuglog('write secret successful (should fail)');
        assert.notOk(true, 'no secret body successfully created!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide an secret to write to the Vault.');
      });
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
      var newVault = new Vault({});
      return newVault.read({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.read().then(function (secret) {
        debuglog('secret: %s', secret);
        assert.notOk(secret, 'get secret successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
    });

    it('empty secret id provided', function () {
      return myVault.read({
        id: ''
      }).then(function (secret) {
        debuglog('secret: %s', secret);
        assert.notOk(secret, 'get secret successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
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
      var newVault = new Vault({});
      return newVault.delete({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('no secret id provided', function () {
      return myVault.delete().then(function () {
        debuglog('delete should fail but was successful');
        assert.notOk(true, 'delete secret successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
    });

    it('empty secret id provided', function () {
      return myVault.delete({
        id: ''
      }).then(function () {
        debuglog('delete should fail but was successful');
        assert.notOk(true, 'delete secret successful!');
      }).then(null, function (err) {
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide secret id.');
      });
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
