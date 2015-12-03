require('./helpers.js').should;

var
  debuglog = require('util').debuglog('vaulted-tests'),
  _ = require('lodash'),
  chai = require('./helpers').chai,
  // assert = require('./helpers').assert,
  Vault = require('../lib/vaulted');

chai.use(require('./helpers').cap);

// if running within container the HOME is fixed; else running locally so assume
// that consul and vault are also running locally.
var VAULT_HOST = process.env.HOME === '/home/appy' ? 'vault' : '127.0.0.1';


describe('mounts', function () {
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

  describe('#getMounts', function () {

    it.skip('should reject with an Error if not initialized or unsealed', function () {
      // errors are being thrown and not rejected; need to convert
      // vaulted.validateEndpoint to be promise based first.
      var newVault = new Vault({});
      return newVault.getMounts().should.be.rejectedWith('Vault has not been initialized');
    });

    it('should update internal state with list of mounts', function () {
      var existingMounts = myVault.mounts;
      return myVault.getMounts().then(function (mounts) {
        existingMounts.should.be.empty;
        mounts.should.not.be.empty;
        existingMounts.should.not.contain.keys('sys/');
        mounts.should.contain.keys('sys/');
      });
    });

  });

  describe('#createMount', function () {

    it('should reject with an Error if not initialized or unsealed');

    it('should reject with an Error if no options provided', function () {
      return myVault.createMount().then(function (mounts) {
        debuglog('createMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount id.');
      });
    });

    it('should reject with an Error if option id empty', function () {
      return myVault.createMount({
        id: ''
      }).then(function (mounts) {
        debuglog('createMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount id successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount id.');
      });
    });

    it('should reject with an Error if option body empty', function () {
      return myVault.createMount({
        id: 'xzy',
        body: null
      }).then(function (mounts) {
        debuglog('createMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount body successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount details.');
      });
    });

    it('should reject with an Error if option body without type', function () {
      return myVault.createMount({
        id: 'xzy',
        body: {}
      }).then(function (mounts) {
        debuglog('createMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount body successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount type.');
      });
    });

    it('should reject with an Error if option body with empty type', function () {
      return myVault.createMount({
        id: 'xzy',
        body: {
          type: ''
        }
      }).then(function (mounts) {
        debuglog('createMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount body type successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount type.');
      });
    });

    it('should resolve to updated list of mounts', function () {
      var existingMounts = _.cloneDeep(myVault.mounts);
      return myVault.createMount({
        id: 'other',
        body: {
          type: 'consul'
        }
      }).then(function (mounts) {
        existingMounts.should.not.be.empty;
        mounts.should.not.be.empty;
        existingMounts.should.not.contain.keys('other/');
        mounts.should.contain.keys('other/');
      });
    });

  });

  describe('#reMount', function () {

    it('should reject no options provided', function () {
      return myVault.reMount().then(function (mounts) {
        debuglog('reMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide from mount.');
      });
    });

    it('should reject empty option from', function () {
      return myVault.reMount({from: ''}).then(function (mounts) {
        debuglog('reMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide from mount.');
      });
    });

    it('should reject no option to', function () {
      return myVault.reMount({from: 'xyz'}).then(function (mounts) {
        debuglog('reMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide to mount.');
      });
    });

    it('should reject empty option to', function () {
      return myVault.reMount({from: 'xyz', to: ''}).then(function (mounts) {
        debuglog('reMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide to mount.');
      });
    });

    it('should reject no existing from mount', function () {
      return myVault.reMount({from: 'xyz', to: 'abc'}).then(function (mounts) {
        debuglog('reMount successful (should fail)', mounts);
        // assert.notOk(mounts, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('Could not find existing mount named: xyz');
      });
    });

    it('should resolve to updated list of mounts', function () {
      var existingMounts = _.cloneDeep(myVault.mounts);
      return myVault.reMount({from: 'other', to: 'sample'}).then(function (mounts) {
        existingMounts.should.not.be.empty;
        mounts.should.not.be.empty;
        existingMounts.should.contain.keys('other/');
        existingMounts.should.not.contain.keys('sample/');
        mounts.should.not.contain.keys('other/');
        mounts.should.contain.keys('sample/');
      });
    });

  });

  describe('#deleteMount', function () {

    it('should reject if no options provided', function () {
      return myVault.deleteMount().then(function (self) {
        debuglog('deleteMount successful (should fail)', self);
        // assert.notOk(self, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount id.');
      });
    });

    it('should reject if no option id provided', function () {
      return myVault.deleteMount({id: ''}).then(function (self) {
        debuglog('deleteMount successful (should fail)', self);
        // assert.notOk(self, 'no mount details successfully created!');
      }).then(null, function (err) {
        debuglog(err);
        err.should.be.an.instanceof(Error);
        err.message.should.equal('You must provide mount id.');
      });
    });

    it('should resolve to updated instance with mount removed', function () {
      var existingMounts = _.cloneDeep(myVault.mounts);
      return myVault.deleteMount({id: 'sample'}).then(function (self) {
        existingMounts.should.not.be.empty;
        self.mounts.should.not.be.empty;
        existingMounts.should.contain.keys('sample/');
        self.mounts.should.not.contain.keys('sample/');
        self.mounts.should.contain.keys('sys/');
      });
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
