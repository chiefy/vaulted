require('./helpers').should;

var
  helpers = require('./helpers'),
  _ = require('lodash'),
  chai = helpers.chai;

chai.use(helpers.cap);


describe('seal', function () {
  var myVault;

  before(function() {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
    });
  });

  describe('#getSealedStatus', function () {

    it('should resolve to binded instance - success', function () {
      return myVault.getSealedStatus().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

  });

  describe('#unSeal', function () {

    it('should resolve to binded instance - success', function () {
      return myVault.unSeal().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    it('should resolve to binded instance - already unsealed', function () {
      return myVault.unSeal().then(function (self) {
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.false;
      });
    });

    it('should be rejected with Error - not initialized', function () {
      myVault.initialized = false;
      return myVault.unSeal().should.be.rejectedWith(/Vault has not been initialized/);
    });

  });

  describe('#seal', function () {

    it('should be rejected with Error - not initialized', function () {
      myVault.initialized = false;
      return myVault.seal().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve to binded instance - success', function () {
      var existing = _.cloneDeep(myVault.status);
      myVault.initialized = true;
      return myVault.seal().then(function (self) {
        existing.should.have.property('sealed');
        existing.sealed.should.be.false;
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

    it('should resolve to binded instance - already sealed', function () {
      var existing = _.cloneDeep(myVault.status);
      myVault.initialized = true;
      return myVault.seal().then(function (self) {
        existing.should.have.property('sealed');
        existing.sealed.should.be.true;
        self.status.should.have.property('sealed');
        self.status.sealed.should.be.true;
      });
    });

  });

  after(function () {
    if (!myVault.status.sealed) {
      return helpers.resealVault(myVault);
    }
  });

});
