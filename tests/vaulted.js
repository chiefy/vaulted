'use strict';
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
          debug: true
        },
        vault = new Vault(options),
        debugflag = vault.config.get('debug');

      debugflag.should.equal(options.debug);
    });

    it('should be in the sealed state by default', function () {
      var vault = new Vault();
      vault.status.sealed.should.be.true;
    });

    it('should throw exception if invalid option provided', function () {
      var
        options = {
          'abcxyz': true,
          'sample': 'value'
        };

      function shouldThrow() {
        new Vault(options);
      }
      shouldThrow.should.throw(/Unsupported option provided/);
    });

    it('should accept token as input and update state accordingly', function () {
      var
        options = {
          vault_token: 'sample.secret'
        },
        vault = new Vault(options);
      vault.token.should.equal('sample.secret');
      vault.headers.should.contain.keys('X-Vault-Token');
    });

    it('verify environment is being pickedup', function () {
      process.env.VAULT_SSL = false;
      var vault = new Vault();
      var vault_ssl = vault.config.get('vault_ssl');
      vault_ssl.should.be.equal(false);
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
      myVault.initialized.should.be.false;
      myVault.setToken('xyzabc');
      myVault.token.should.equal('xyzabc');
      myVault.headers.should.contain.keys('X-Vault-Token');
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
      shouldThrow.should.throw(/Could not find endpoint/);
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
