'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect;

chai.use(helpers.cap);

describe('auth/github', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;
  var authData = {
    id: 'github',
    body: {
      type: 'github'
    }
  };

  before(function (done) {
    helpers
      .getReadyVault()
      .then(function (vault) {
        myVault = vault;
        return myVault.createAuthMount(authData);
      })
      .finally(done);
  });


  describe('#githubLogin', function() {

    var tokenData = {
      body: {
        token: 'some-fake-token'
      }
    };

    it('should fail if vault has not been initialized', function() {
      newVault.githubLogin()
        .should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should fail when auth backend has not been mounted', function(done) {
      helpers
        .getReadyVault()
        .then(function(vault) {
          vault.githubLogin(tokenData).should.be.rejected;
          done();
        });
    });

    it('should fail when not given a token as argument', function() {
      var missing_token = /Missing required input token/;
      myVault.githubLogin().should.be.rejectedWith(missing_token);
      myVault.githubLogin({ body: null }).should.be.rejectedWith(missing_token);
    });

  });
});

