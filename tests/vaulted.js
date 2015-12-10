require('./helpers').should;

var
  helpers = require('./helpers'),
  _ = require('lodash'),
  Vault = require('../lib/vaulted');


describe('Vaulted', function () {

  describe('#constructor', function () {

    var old_VAULT_ADDR = null;

    before(function () {
      if (process.env.VAULT_ADDR) {
        old_VAULT_ADDR = process.env.VAULT_ADDR;
        delete process.env.VAULT_ADDR;
      }
    });

    after(function () {
      if (old_VAULT_ADDR) {
        process.env.VAULT_ADDR = old_VAULT_ADDR;
      }
    });

    it('should create a new instance', function () {
      var vault = new Vault();
      vault.should.be.instanceof(Vault);
    });

    it('should take an empty options hash', function () {
      var vault = new Vault({});
      vault.should.be.an.instanceof(Vault);
    });

    it('should take an options hash, and override any default settings', function () {
      var
        options = {
          debug: 1,
          vault_url: 'https://some.other.host:1234',
          env: 'test'
        },
        vault = new Vault(options),
        env = vault.config.get('env');

      env.should.equal(options.env);
    });

    it('should throw an error when it can\'t find an api definition', function () {
      function shouldThrow() {
        return new Vault({
          prefix: 'vdfsdf4'
        });
      }
      shouldThrow.should.throw(Error);
    });

    it('should be in the sealed state by default', function () {
      var vault = new Vault();
      vault.status.sealed.should.be.true;
    });

  });

  describe('#methods', function () {
    var myVault = helpers.getVault();

    it('setToken null', function () {
      function shouldThrow() {
        myVault.setToken();
      }
      shouldThrow.should.throw(/Vault token not provided/);
    });

    it('setToken empty String', function () {
      function shouldThrow() {
        myVault.setToken('');
      }
      shouldThrow.should.throw(/Vault token not provided/);
    });

    it('setToken success', function () {
      myVault.setToken('xyzabc');
      myVault.token.should.equal('xyzabc');
      myVault.headers.should.contain.keys('X-Vault-Token');
    });

    it('setKeys undefined', function () {
      function shouldThrow() {
        myVault.setKeys();
      }
      shouldThrow.should.throw(/Vault keys not provided/);
    });

    it('setKeys empty Array', function () {
      function shouldThrow() {
        myVault.setKeys([]);
      }
      shouldThrow.should.throw(/Vault keys not provided/);
    });

    it('setKeys success', function () {
      myVault.initialized.should.be.false;
      myVault.setKeys(['xyzabc', 'abcxyz']);
      myVault.keys.should.contain('xyzabc');
      myVault.keys.should.contain('abcxyz');
      myVault.initialized.should.be.true;
      myVault.initialized = false;
    });

    it('setStatus null', function () {
      var current = _.cloneDeep(myVault.status);
      myVault.setStatus();
      myVault.status.should.contain.keys('sealed');
      myVault.status.sealed.should.be.equal(current.sealed);
    });

    it('setStatus empty', function () {
      var current = _.cloneDeep(myVault.status);
      myVault.setStatus({});
      myVault.status.should.contain.keys('sealed');
      myVault.status.sealed.should.be.equal(current.sealed);
    });

    it('setStatus success', function () {
      myVault.setStatus({
        sealed: false
      });
      myVault.status.sealed.should.be.false;
    });

    it('validateEndpoint - no input provided', function () {
      myVault.initialized = true;
      myVault.status.sealed = false;

      function shouldThrow() {
        myVault.validateEndpoint();
      }
      shouldThrow.should.throw(/Endpoint not provided/);
    });

    it('validateEndpoint - empty string provided', function () {
      function shouldThrow() {
        myVault.validateEndpoint('');
      }
      shouldThrow.should.throw(/Endpoint not provided/);
      myVault.initialized = false;
      myVault.status.sealed = true;
    });

    it('validateEndpoint - not initialized', function () {
      function shouldThrow() {
        myVault.validateEndpoint('xyz');
      }
      shouldThrow.should.throw(/Vault has not been initialized/);
    });

    it('validateEndpoint - sealed', function () {
      function shouldThrow() {
        myVault.validateEndpoint('xyz');
      }
      myVault.initialized = true;
      myVault.status.sealed = true;
      shouldThrow.should.throw(/Vault has not been unsealed/);
    });

    it('validateEndpoint - unknown endpoint', function () {
      function shouldThrow() {
        myVault.validateEndpoint('xyz');
      }
      myVault.initialized = true;
      myVault.status.sealed = false;
      shouldThrow.should.throw(/Could not get API for/);
    });

    it('validateEndpoint - success', function () {
      myVault.initialized = true;
      myVault.status.sealed = false;
      var ep = myVault.validateEndpoint('sys/remount');
      ep.should.not.be.null;
      ep.should.contain.keys('name');
      ep.name.should.be.equal('sys/remount');
      ep.should.contain.keys('verbs');
      ep.verbs.should.exist;
    });

  });

});
