require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  _ = require('lodash'),
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('auth/tokens', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
    });

  });

  describe('#createToken', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.createToken().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with token - no options', function () {
      return myVault.createToken().then(function (token) {
        debuglog('token: ', token);
        expect(token).to.not.be.undefined;
        token.should.have.property('auth');
        token.auth.should.have.property('client_token');
        token.auth.client_token.should.be.ok;
        token.auth.should.have.property('policies');
        token.auth.policies.should.be.ok;
        token.auth.should.have.property('metadata');
        token.auth.should.have.property('lease_duration');
        token.auth.should.have.property('renewable');
      });
    });

    it('should resolve with token - meta provided', function () {
      return myVault.createToken({
        body: {
          meta: {
            type: 'test token'
          }
        }
      }).then(function (token) {
        debuglog('token: ', token);
        expect(token).to.not.be.undefined;
        token.should.have.property('auth');
        token.auth.should.have.property('client_token');
        token.auth.client_token.should.be.ok;
        token.auth.should.have.property('policies');
        token.auth.policies.should.be.ok;
        token.auth.should.have.property('metadata');
        token.auth.should.have.property('lease_duration');
        token.auth.should.have.property('renewable');
      });
    });

  });

  describe('#renewToken', function () {
    var myRootToken;
    var myToken;

    beforeEach(function () {
      return myVault.createToken().then(function (token) {
        myRootToken = _.clone(myVault.token);
        myToken = token.auth.client_token;
        myVault.setToken(myToken);
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.renewToken({
        id: 'abcxyz'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.renewToken().should.be.rejectedWith(/You must provide client token/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.renewToken({
        id: ''
      }).should.be.rejectedWith(/You must provide client token/);
    });

    it('should be resolved with a renewed token', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {
        debuglog('token: ', token);
        myVault.setToken(token.auth.client_token);
        return myVault.renewToken({
          id: token.auth.client_token
        }).then(function (renewed) {
          debuglog('renewed: ', renewed);
          expect(renewed).to.not.be.undefined;
          renewed.should.have.property('auth');
          renewed.auth.should.have.property('client_token');
          renewed.auth.client_token.should.be.ok;
          renewed.auth.should.have.property('policies');
          renewed.auth.policies.should.be.ok;
          renewed.auth.should.have.property('metadata');
          renewed.auth.should.have.property('lease_duration');
          renewed.auth.should.have.property('renewable');
          renewed.auth.renewable.should.be.true;
        });
      });
    });

    it('should be resolved with a renewed token - with optional body', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {
        debuglog('token: ', token);
        myVault.setToken(token.auth.client_token);

        return myVault.renewToken({
          id: token.auth.client_token,
          body: {
            increment: 60
          }
        }).then(function (renewed) {
          debuglog('renewed: ', renewed);
          expect(renewed).to.not.be.undefined;
          renewed.should.have.property('auth');
          renewed.auth.should.have.property('client_token');
          renewed.auth.client_token.should.be.ok;
          renewed.auth.should.have.property('policies');
          renewed.auth.policies.should.be.ok;
          renewed.auth.should.have.property('metadata');
          renewed.auth.should.have.property('lease_duration');
          renewed.auth.should.have.property('renewable');
          renewed.auth.renewable.should.be.true;
        });
      });
    });

    afterEach(function () {
      myVault.setToken(myRootToken);
    });

  });

  describe('#lookupToken', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.lookupToken({
        id: 'abcxyz'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.lookupToken().should.be.rejectedWith(/You must provide client token/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.lookupToken({
        id: ''
      }).should.be.rejectedWith(/You must provide client token/);
    });

    it('should resolve to the specified token', function () {
      return myVault.lookupToken({
        id: myVault.token
      }).then(function (token) {
        debuglog('token: ', token);
        expect(token).to.not.be.undefined;
        token.should.have.property('data');
        token.data.should.have.property('id');
        token.data.id.should.be.ok;
        token.data.should.have.property('policies');
        token.data.policies.should.be.ok;
        token.data.should.have.property('path');
        token.data.path.should.be.equal('auth/token/root');
        token.data.should.have.property('meta');
        token.data.should.have.property('display_name');
        token.data.should.have.property('num_uses');
      });
    });

  });

  describe('#revokeToken', function () {
    var myRootToken;
    var myToken;

    beforeEach(function () {
      return myVault.createToken().then(function (token) {
        myRootToken = _.clone(myVault.token);
        myToken = token.auth.client_token;
        myVault.setToken(myToken);
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeToken({
        id: 'abcxyz'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.revokeToken().should.be.rejectedWith(/You must provide client token/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.revokeToken({
        id: ''
      }).should.be.rejectedWith(/You must provide client token/);
    });

    it('should be resolved', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {

        debuglog('token: ', token);
        myVault.setToken(token.auth.client_token);

        return myVault.revokeToken({
          id: token.auth.client_token
        }).should.be.fulfilled;

      });
    });

    afterEach(function () {
      myVault.setToken(myRootToken);
    });

  });

  describe('#revokeTokenOrphan', function () {
    var myRootToken;
    var myToken;

    beforeEach(function () {
      return myVault.createToken().then(function (token) {
        myRootToken = _.clone(myVault.token);
        myToken = token.auth.client_token;
        myVault.setToken(myToken);
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeTokenOrphan({
        id: 'abcxyz'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.revokeTokenOrphan().should.be.rejectedWith(/You must provide client token/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.revokeTokenOrphan({
        id: ''
      }).should.be.rejectedWith(/You must provide client token/);
    });

    it('should be resolved', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {

        debuglog('parent token: ', token);
        myVault.setToken(token.auth.client_token);

        return myVault.createToken({
          body: {
            ttl: '1h'
          }
        }).then(function (childtoken) {

          debuglog('child token: ', childtoken);

          return myVault.revokeTokenOrphan({
            id: token.auth.client_token
          }).should.be.fulfilled;

        });

      });
    });

    afterEach(function () {
      myVault.setToken(myRootToken);
    });

  });

  describe('#revokeTokenPrefix', function () {
    var myRootToken;
    var myToken;

    beforeEach(function () {
      return myVault.createToken().then(function (token) {
        myRootToken = _.clone(myVault.token);
        myToken = token.auth.client_token;
        myVault.setToken(myToken);
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeTokenPrefix({
        id: 'abcxyz'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.revokeTokenPrefix().should.be.rejectedWith(/You must provide token prefix/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.revokeTokenPrefix({
        id: ''
      }).should.be.rejectedWith(/You must provide token prefix/);
    });

    it('should resolve after token prefix revoked', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {

        debuglog('parent token: ', token);
        myVault.setToken(token.auth.client_token);

        return myVault.createToken({
          body: {
            ttl: '1h'
          }
        }).then(function (childtoken) {

          debuglog('child token: ', childtoken);

          return myVault.revokeTokenPrefix({
            id: 'token/'
          }).should.be.fulfilled;

        });

      });
    });

    afterEach(function () {
      myVault.setToken(myRootToken);
    });

  });

  describe('#lookupTokenSelf', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.lookupTokenSelf().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve to the specified token', function () {
      return myVault.lookupTokenSelf().then(function (token) {
        debuglog('token: ', token);
        expect(token).to.not.be.undefined;
        token.should.have.property('data');
        token.data.should.have.property('id');
        token.data.id.should.be.ok;
        token.data.should.have.property('policies');
        token.data.policies.should.be.ok;
        token.data.should.have.property('path');
        token.data.path.should.be.equal('auth/token/root');
        token.data.should.have.property('meta');
        token.data.should.have.property('display_name');
        token.data.should.have.property('num_uses');
      });
    });

  });

  describe('#revokeTokenSelf', function () {
    var myRootToken;
    var myToken;

    beforeEach(function () {
      return myVault.createToken().then(function (token) {
        myRootToken = _.clone(myVault.token);
        myToken = token.auth.client_token;
        myVault.setToken(myToken);
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeTokenSelf().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should be resolved', function () {
      return myVault.createToken({
        body: {
          ttl: '1h'
        }
      }).then(function (token) {
        debuglog('token: ', token);
        myVault.setToken(token.auth.client_token);
        return myVault.revokeTokenSelf().should.be.fulfilled;
      });
    });

    afterEach(function () {
      myVault.setToken(myRootToken);
    });

  });

});
