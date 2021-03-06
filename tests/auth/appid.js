'use strict';
require('../helpers').should;

var
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('auth/appid', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      return myVault.createAuthMount({
        id: 'app-id',
        body: {
          type: 'app-id'
        }
      });
    });

  });

  describe('#createApp', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.createApp({
        id: 'fake',
        body: {
          value: 'root',
          display_name: 'test-fake'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.createApp().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.createApp({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.createApp({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.createApp({
        id: 'fake'
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.createApp({
        id: 'fake',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no value provided in body', function () {
      return myVault.createApp({
        id: 'fake',
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty value provided in body', function () {
      return myVault.createApp({
        id: 'fake',
        body: {
          value: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no display_name provided in body', function () {
      return myVault.createApp({
        id: 'fake',
        body: {
          value: 'root'
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty display_name provided in body', function () {
      return myVault.createApp({
        id: 'fake',
        body: {
          value: 'root',
          display_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return assert.isFulfilled(myVault.createApp({
        id: 'fakeapp',
        body: {
          value: 'root',
          display_name: 'TheFakeApp'
        }
      }));
    });

  });

  describe('#getApp', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getApp({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.getApp().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.getApp({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.getApp({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getApp({
        id: 'fakeapp',
      }).then(function (app) {
        debuglog(app);
        expect(app).should.not.be.undefined;
        app.should.have.property('lease_id');
        app.should.have.property('renewable');
        app.should.have.property('lease_duration');
        app.should.have.property('data');
        expect(app.data).not.to.be.undefined;
        expect(app.data).not.to.be.null;
        app.data.should.have.property('key');
        app.data.key.should.be.equal('fakeapp');
        app.data.should.have.property('value');
        app.data.should.have.property('display_name');
      });
    });

  });

  describe('#createUser', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.createUser({
        id: 'fake',
        body: {
          value: 'other'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.createUser().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.createUser({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.createUser({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.createUser({
        id: 'fake'
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.createUser({
        id: 'fake',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no value provided in body', function () {
      return myVault.createUser({
        id: 'fake',
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty value provided in body', function () {
      return myVault.createUser({
        id: 'fake',
        body: {
          value: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return assert.isFulfilled(myVault.createUser({
        id: 'fakeuser',
        body: {
          value: 'fakeapp'
        }
      }));
    });

  });

  describe('#getUser', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getUser({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.getUser().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.getUser({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.getUser({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getUser({
        id: 'fakeuser',
      }).then(function (user) {
        debuglog(user);
        expect(user).should.not.be.undefined;
        user.should.have.property('lease_id');
        user.should.have.property('renewable');
        user.should.have.property('lease_duration');
        user.should.have.property('data');
        expect(user.data).not.to.be.undefined;
        expect(user.data).not.to.be.null;
        user.data.should.have.property('key');
        user.data.key.should.be.equal('fakeuser');
        user.data.should.have.property('value');
        user.data.value.should.be.equal('fakeapp');
      });
    });

  });

  describe('#appLogin', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.appLogin({
        body: {
          app_id: 'fakeapp',
          user_id: 'fakeuser'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.appLogin().should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.appLogin({}).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.appLogin({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no app_id provided in body', function () {
      return myVault.appLogin({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty app_id provided in body', function () {
      return myVault.appLogin({
        body: {
          app_id: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no user_id provided in body', function () {
      return myVault.appLogin({
        body: {
          app_id: 'fakeapp'
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty user_id provided in body', function () {
      return myVault.appLogin({
        body: {
          app_id: 'fakeapp',
          user_id: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.appLogin({
        body: {
          app_id: 'fakeapp',
          user_id: 'fakeuser'
        }
      }).then(function (authres) {
        debuglog('applogin: ', authres);
        expect(authres).should.not.be.undefined;
        authres.should.have.property('lease_id');
        authres.should.have.property('renewable');
        authres.should.have.property('lease_duration');
        authres.should.have.property('data');
        authres.should.have.property('auth');
        authres.auth.should.have.property('client_token');
        authres.auth.client_token.should.not.be.undefined;
        authres.auth.should.have.property('policies');
        authres.auth.policies.should.not.be.undefined;
      });
    });

  });

  describe('#deleteUser', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deleteUser({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.deleteUser().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.deleteUser({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.deleteUser({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.deleteUser({
        id: 'fakeuser',
      }).should.be.fullfilled;
    });

  });

  describe('#deleteApp', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deleteApp({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.deleteApp().should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.deleteApp({}).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.deleteApp({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.deleteApp({
        id: 'fakeapp',
      }).should.be.fullfilled;
    });

  });

  after(function () {
    return myVault.deleteAuthMount({
      id: 'app-id'
    });
  });

});
