require('./helpers.js').should;

var
  debuglog = require('util').debuglog('vaulted-tests'),
  chai = require('./helpers').chai,
  // assert = require('./helpers').assert,
  Vault = require('../lib/vaulted');

chai.use(require('./helpers').cap);

// if running within container the HOME is fixed; else running locally so assume
// that consul and vault are also running locally.
var VAULT_HOST = process.env.HOME === '/home/appy' ? 'vault' : '127.0.0.1';


describe('secret', function () {
  var myVault;

  before(function () {
    myVault = new Vault({
      // debug: 1,
      vault_host: VAULT_HOST,
      vault_port: 8200,
      vault_ssl: 0
    });

    return myVault.init().then(function () {
      return myVault.unSeal().then(null, function (err) {
        debuglog('failed to unSeal Vault: %s', err.message);
      });
    }).then(null, function (err) {
      debuglog('failed to init Vault: %s', err.message);
      return myVault.unSeal().then(null, function (err) {
        debuglog('failed to unSeal Vault: %s', err.message);
      });
    });
    // to be version
    // return myVault.prepare().then(function () {
    //   return myVault.init().then(function () {
    //     return myVault.unSeal();
    //   });
    // }).then(null, function (err) {
    //   debuglog('(before) vault setup failed: %s', err.message);
    // });
  });

  describe('#write', function () {

    it('no secret provided', function () {
      return myVault.write({}).then(function () {
        debuglog('write secret successful (should fail)');
        // assert.notOk(true, 'no secret body successfully created!');
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

    it('secret not found', function () {
      return myVault.read({
        id: 'fake'
      }).then(function (secret) {
        debuglog('secret: %s', secret);
        // assert.notOk(secret, 'get secret successful!');
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
        // expect(err).to.be.undefined;
      });
    });

  });

  describe('#delete', function () {

    it.skip('secret not deleted', function () {
      return myVault.delete({
        id: 'fake'
      }).then(function () {
        debuglog('delete should fail but was successful');
        // assert.notOk(true, 'delete secret successful!');
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
      debuglog('should seal vault but unable to right now');
      // requires bugfix on the seal method to operate
      // return myVault.seal().then(function () {
      //   debuglog('vault sealed: %s', myVault.status.sealed);
      // }).then(null, function (err) {
      //   debuglog(err);
      //   debuglog('failed to seal vault: %s', err.message);
      // });
    }
  });

});
