'use strict';
require('../helpers').should;

var
  fs = require('fs'),
  path = require('path'),
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);

var testVaultErrors = function (err, expected) {
  expect(err).not.to.be.undefined;
  err.should.have.property('error');
  expect(err.error).not.to.be.undefined;
  expect(err.error).not.to.be.null;
  err.error.should.have.property('errors');
  expect(err.error.errors).not.to.be.undefined;
  expect(err.error.errors).not.to.be.null;
  err.error.errors.should.be.instanceof(Array);
  err.error.errors.length.should.equal(1);
  expect(err.error.errors[0]).not.to.be.undefined;
  expect(err.error.errors[0]).not.to.be.null;
  err.error.errors[0].should.match(expected);
};

describe('transit', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      return myVault.mountTransit();
    });
  });

  describe('Mount transit endpoint', function () {

    it('should mount the transit endpoint', function () {
      return helpers.getReadyVault().then(function (vault) {
        expect(vault.mounts).to.have.property('transit/');
        expect(vault.api.endpoints).to.have.property('transit/keys/:id');
        expect(vault.api.endpoints).to.have.property('transit/keys/:id/config');
        expect(vault.api.endpoints).to.have.property('transit/keys/:id/rotate');
        expect(vault.api.endpoints).to.have.property('transit/encrypt/:id');
        expect(vault.api.endpoints).to.have.property('transit/decrypt/:id');
        expect(vault.api.endpoints).to.have.property('transit/rewrap/:id');
        expect(vault.api.endpoints).to.have.property('transit/datakey/plaintext/:id');
        expect(vault.api.endpoints).to.have.property('transit/datakey/wrapped/:id');
      });
    });
  });

  describe('#setTransitKey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setTransitKey({
        id: 'sample'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if convergent encryption is set and key derivation is not', function () {
      return myVault.setTransitKey({
        id: 'sample',
        body: {
          convergent_encryption: true
        }
      }).should.be.rejectedWith(/Convergent encryption requires key derivation to be set/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.setTransitKey().should.be.rejectedWith(/requires an id/);
    });

    it('should create a new named encryption key', function () {
      return myVault.setTransitKey({
        id: 'sample'
      }).then(function () {
        return myVault.getTransitKey({id: 'sample'}).should.not.be.rejected;
      });
    });
  });

  describe('#getTransitKey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setTransitKey({id: 'sample'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.getTransitKey().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if the requested key does not exist', function () {
      return myVault.getTransitKey({id: 'foo'}).should.be.rejectedWith(/404/);
    });

    it('should resolve with information about the encryption key', function () {
      return myVault.getTransitKey({
        id: 'sample'
      }).then(function(key) {
        debuglog(key);
        expect(key).not.to.be.undefined;
        key.should.have.property('data');
        expect(key.data).not.to.be.undefined;
        expect(key.data).not.to.be.null;
        key.data.should.have.property('cipher_mode');
        key.data.should.have.property('deletion_allowed');
        key.data.should.have.property('derived');
        key.data.should.have.property('min_decryption_version');
        key.data.should.have.property('name');
        key.data.should.have.property('keys');
        expect(key.data.keys).not.to.be.undefined;
        expect(key.data.keys).not.to.be.null;
        Object.keys(key.data.keys).length.should.be.above(0);
      });
    });
  });

  describe('#deleteTransitKey', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deleteTransitKey({id: 'sample'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.deleteTransitKey().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if the requested key does not exist', function () {
      return myVault.deleteTransitKey({id: 'foo'}).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /could not delete policy; not found/);
      });
    });

    it('should not be able to delete the named key by default (deletion_allowed = false)', function () {
      return myVault.deleteTransitKey({id: 'sample'}).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /deletion is not allowed for this policy/);
      });
    });

    before(function () {
      return myVault.setTransitKey({id: 'tobedeleted'}).then(function() {
        return myVault.setTransitKeyConfig({
          id: 'tobedeleted',
          body: {
            deletion_allowed: true
          }
        });
      });
    });

    it('should be able to delete the named key if deletion_enabled = true', function () {
      return myVault.deleteTransitKey({id: 'tobedeleted'}).then(function () {
        return myVault.getTransitKey({id: 'tobedeleted'}).should.be.rejectedWith(/404/);
      });
    });
  });

  describe('#setTransitKeyConfig', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setTransitKeyConfig({id: 'sample'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.setTransitKeyConfig().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if the requested key does not exist', function () {
      return myVault.setTransitKeyConfig({id: 'foo'}).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /no existing key named foo could be found/);
      });
    });

    it('should update the key configuration if a config value is changed', function () {
      return myVault.getTransitKey({id: 'sample'}).then(function (key) {
        debuglog(key);
        expect(key).not.to.be.undefined;
        key.should.have.property('data');
        expect(key.data).not.to.be.undefined;
        expect(key.data).not.to.be.null;
        key.data.should.have.property('deletion_allowed');
        key.data.deletion_allowed.should.equal(false);
      }).then(function() {
        return myVault.setTransitKeyConfig({
          id: 'sample',
          body: {
            deletion_allowed: true
          }
        }).then(function () {
          return myVault.getTransitKey({id: 'sample'}).then(function (key) {
            debuglog(key);
            expect(key).not.to.be.undefined;
            key.should.have.property('data');
            expect(key.data).not.to.be.undefined;
            expect(key.data).not.to.be.null;
            key.data.should.have.property('deletion_allowed');
            key.data.deletion_allowed.should.equal(true);
          })
        });
      });
    });
  });

  describe('#rotateTransitKey', function () {

    before(function () {
      return myVault.setTransitKey({id: 'rotatingkey'}).then(function () {
        return myVault.setTransitKeyConfig({
          id: 'rotatingkey',
          body: {
            deletion_allowed: true
          }
        })
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'rotatingkey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.rotateTransitKey({id: 'rotatingkey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.rotateTransitKey().should.be.rejectedWith(/requires an id/);
    });

    it('should rotate the named key to a new version', function () {
      return myVault.getTransitKey({id: 'rotatingkey'})
        .then(function (key) {
          debuglog(key);
          expect(key).not.to.be.undefined;
          key.should.have.property('data');
          expect(key.data).not.to.be.undefined;
          expect(key.data).not.to.be.null;
          key.data.should.have.property('keys');
          key.data.should.have.property('latest_version');
          key.data.latest_version.should.equal(1);
          Object.keys(key.data.keys).length.should.equal(1);
        }).then(function () {
          return myVault.rotateTransitKey({id: 'rotatingkey'});
        }).then(function () {
          return myVault.getTransitKey({id: 'rotatingkey'});
        }).then(function (rotatedKey) {
          debuglog(rotatedKey);
          expect(rotatedKey).not.to.be.undefined;
          rotatedKey.should.have.property('data');
          expect(rotatedKey.data).not.to.be.undefined;
          expect(rotatedKey.data).not.to.be.null;
          rotatedKey.data.should.have.property('keys');
          rotatedKey.data.should.have.property('latest_version');
          rotatedKey.data.latest_version.should.equal(2);
          Object.keys(rotatedKey.data.keys).length.should.equal(2);
        });
    });
  });

  describe('#encryptTransitPlainText', function () {
    before(function () {
      return myVault.setTransitKey({id: 'encryptingkey'}).then(function () {
        return myVault.setTransitKeyConfig({
          id: 'encryptingkey',
          body: {
            deletion_allowed: true
          }
        })
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'encryptingkey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.encryptTransitPlainText({id: 'encryptingkey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.encryptTransitPlainText().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no plaintext is provided', function () {
      return myVault.encryptTransitPlainText({id: 'encryptingkey'}).should.be.rejectedWith(/Missing required input plaintext/);
    });

    it('should reject with an Error if the plaintext is not base64 encoded', function () {
      return myVault.encryptTransitPlainText({
        id: 'encryptingkey',
        body: {
          plaintext: 'notencodedatall!'
        }
      }).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /failed to decode plaintext as base64/);
      });
    });

    it('should resolve with an object containing the encrypted plaintext as ciphertext', function () {
      return myVault.encryptTransitPlainText({
        id: 'encryptingkey',
        body: {
          plaintext: 'dGhpc2lzc29tZXJlYWxseWxvbmdwYXNzd29yZG9yc29tZXRoaW5n'
        }
      }).then(function (encryptedText) {
        debuglog(encryptedText);
        expect(encryptedText).not.to.be.undefined;
        encryptedText.should.have.property('data');
        expect(encryptedText.data).not.to.be.undefined;
        expect(encryptedText.data).not.to.be.null;
        encryptedText.data.should.have.property('ciphertext');
        encryptedText.data.ciphertext.should.match(/vault:v1/);
      });
    });
  });

  describe('#decryptTransitCipherText', function () {
    var plaintext = new Buffer('somesecretthatwereallyneed').toString('base64');
    var ciphertext;

    before(function () {
      return myVault.setTransitKey({id: 'decryptingkey'}).then(function () {
        return myVault.setTransitKeyConfig({id: 'decryptingkey', body: {deletion_allowed: true}})
      }).then(function () {
        return myVault.encryptTransitPlainText({id: 'decryptingkey', body: {plaintext: plaintext}});
      }).then(function (key) {
        ciphertext = key.data.ciphertext;
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'decryptingkey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.decryptTransitCipherText({id: 'decryptingkey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.decryptTransitCipherText().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no ciphertext is provided', function () {
      return myVault.decryptTransitCipherText({id: 'decryptingkey'}).should.be.rejectedWith(/Missing required input ciphertext/);
    });

    it('should reject with an Error if the provided ciphertext is invalid', function () {
      return myVault.decryptTransitCipherText({
        id: 'decryptingkey',
        body: {
          ciphertext: 'foobarbaz'
        }
      }).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /invalid ciphertext: no prefix/);
      });
    });

    it('should reject with an Error if the provided ciphertext has a valid prefix but is invalid', function () {
      return myVault.decryptTransitCipherText({
        id: 'decryptingkey',
        body: {
          ciphertext: 'vault:v1:foobarbaz'
        }
      }).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /invalid ciphertext: could not decode base64/);
      });
    });

    it('should reject with an Error if the provided ciphertext has a valid prefix and the body is base64 encoded but' +
      ' it is not a valid ciphertext', function () {
      var encodedBadCipherText = new Buffer('foobarbaz').toString('base64');

      return myVault.decryptTransitCipherText({
        id: 'decryptingkey',
        body: {
          ciphertext: 'vault:v1:' + encodedBadCipherText
        }
      }).should.be.rejectedWith(/socket hang up/);
    });

    it('should resolve with an object containing the decrypted ciphertext as plaintext', function () {
      return myVault.decryptTransitCipherText({
        id: 'decryptingkey',
        body: {
          ciphertext: ciphertext
        }
      }).then(function (decryptedText) {
        debuglog(decryptedText);
        expect(decryptedText).not.to.be.undefined;
        decryptedText.should.have.property('data');
        expect(decryptedText.data).not.to.be.undefined;
        expect(decryptedText.data).not.to.be.null;
        decryptedText.data.should.have.property('plaintext');

        var secret = new Buffer(decryptedText.data.plaintext, 'base64').toString();
        secret.should.equal('somesecretthatwereallyneed');
      });
    })
  });

  describe('#rewrapTransitCipherText', function () {

    var plaintext = new Buffer('somesecretthatwereallyneed').toString('base64');
    var ciphertext;

    before(function () {
      return myVault.setTransitKey({id: 'rewrappingkey'}).then(function () {
        return myVault.setTransitKeyConfig({id: 'rewrappingkey', body: {deletion_allowed: true}})
      }).then(function () {
        return myVault.encryptTransitPlainText({id: 'rewrappingkey', body: {plaintext: plaintext}});
      }).then(function (key) {
        ciphertext = key.data.ciphertext;
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'rewrappingkey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.rewrapTransitCipherText({id: 'rewrappingkey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.rewrapTransitCipherText().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no ciphertext is provided', function () {
      return myVault.rewrapTransitCipherText({id: 'rewrappingkey'}).should.be.rejectedWith(/Missing required input ciphertext/);
    });

    it('should reject with an Error if the provided ciphertext is invalid', function () {
      return myVault.rewrapTransitCipherText({
        id: 'rewrappingkey',
        body: {
          ciphertext: 'foobarbaz'
        }
      }).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /invalid ciphertext: no prefix/);
      });
    });

    it('should reject with an Error if the provided ciphertext has a valid prefix but is invalid', function () {
      return myVault.rewrapTransitCipherText({
        id: 'rewrappingkey',
        body: {
          ciphertext: 'vault:v1:foobarbaz'
        }
      }).catch(function (err) {
        debuglog(err);
        return testVaultErrors(err, /invalid ciphertext: could not decode base64/);
      });
    });

    it('should reject with an Error if the provided ciphertext has a valid prefix and the body is base64 encoded but' +
      ' it is not a valid ciphertext', function () {
      var encodedBadCipherText = new Buffer('foobarbaz').toString('base64');

      return myVault.rewrapTransitCipherText({
        id: 'rewrappingkey',
        body: {
          ciphertext: 'vault:v1:' + encodedBadCipherText
        }
      }).should.be.rejectedWith(/socket hang up/);
    });

    it('should resolve with an object containing the rewrapped key', function () {
      return myVault.rewrapTransitCipherText({
        id: 'rewrappingkey',
        body: {
          ciphertext: ciphertext
        }
      }).then(function (reWrappedText) {
        debuglog(reWrappedText);
        expect(reWrappedText).not.to.be.undefined;
        reWrappedText.should.have.property('data');
        expect(reWrappedText.data).not.to.be.undefined;
        expect(reWrappedText.data).not.to.be.null;
        reWrappedText.data.should.have.property('ciphertext');
        reWrappedText.data.ciphertext.should.not.equal(ciphertext);
      }).then(function () {
        return myVault.decryptTransitCipherText({
          id: 'rewrappingkey',
          body: {
            ciphertext: ciphertext
          }
        });
      }).then(function (decryptedText) {
        debuglog(decryptedText);
        expect(decryptedText).not.to.be.undefined;
        decryptedText.should.have.property('data');
        expect(decryptedText.data).not.to.be.undefined;
        expect(decryptedText.data).not.to.be.null;
        decryptedText.data.should.have.property('plaintext');

        var secret = new Buffer(decryptedText.data.plaintext, 'base64').toString();
        secret.should.equal('somesecretthatwereallyneed');
      });
    });
  });

  describe('#generateTransitPlainTextDataKey', function () {

    var plaintext = new Buffer('somesecretthatwereallyneed').toString('base64');
    var ciphertext;

    before(function () {
      return myVault.setTransitKey({id: 'datakey'}).then(function () {
        return myVault.setTransitKeyConfig({id: 'datakey', body: {deletion_allowed: true}})
      }).then(function () {
        return myVault.encryptTransitPlainText({id: 'datakey', body: {plaintext: plaintext}});
      }).then(function (key) {
        ciphertext = key.data.ciphertext;
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'datakey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.generateTransitPlainTextDataKey({id: 'datakey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.generateTransitPlainTextDataKey().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if the id is not found', function () {
      return myVault.generateTransitPlainTextDataKey({id: 'rewrappingkey'})
        .catch(function (err) {
          debuglog(err);
          return testVaultErrors(err, /policy not found/);
        });
    });

    it('should resolve with a new key and its plaintext value', function () {
      return myVault.generateTransitPlainTextDataKey({id: 'datakey'})
        .then(function (key) {
          debuglog(key);
          expect(key).not.to.be.undefined;
          key.should.have.property('data');
          expect(key.data).not.to.be.undefined;
          expect(key.data).not.to.be.null;
          key.data.should.have.property('ciphertext');
          key.data.should.have.property('plaintext');
        });
    });
  });

  describe('#generateTransitWrappedDataKey', function () {

    var plaintext = new Buffer('somesecretthatwereallyneed').toString('base64');
    var ciphertext;

    before(function () {
      return myVault.setTransitKey({id: 'datakey'}).then(function () {
        return myVault.setTransitKeyConfig({id: 'datakey', body: {deletion_allowed: true}})
      }).then(function () {
        return myVault.encryptTransitPlainText({id: 'datakey', body: {plaintext: plaintext}});
      }).then(function (key) {
        ciphertext = key.data.ciphertext;
      });
    });

    after(function () {
      return myVault.deleteTransitKey({id: 'datakey'});
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.generateTransitWrappedDataKey({id: 'datakey'}).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no key name is provided', function () {
      return myVault.generateTransitWrappedDataKey().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if the id is not found', function () {
      return myVault.generateTransitWrappedDataKey({id: 'rewrappingkey'})
        .catch(function (err) {
          debuglog(err);
          return testVaultErrors(err, /policy not found/);
        });
    });

    it('should resolve with a new key and its plaintext value', function () {
      return myVault.generateTransitWrappedDataKey({id: 'datakey'})
        .then(function (key) {
          debuglog(key);
          expect(key).not.to.be.undefined;
          key.should.have.property('data');
          expect(key.data).not.to.be.undefined;
          expect(key.data).not.to.be.null;
          key.data.should.have.property('ciphertext');
          key.data.should.not.have.property('plaintext');
        });
    });
  });
});
