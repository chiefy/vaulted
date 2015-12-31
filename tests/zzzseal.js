require('./helpers').should;

var
  helpers = require('./helpers'),
  _ = require('lodash'),
  chai = helpers.chai;

chai.use(helpers.cap);


describe('#seal', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before(function() {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
    });
  });

  it('should be rejected with Error - not initialized', function () {
    return newVault.seal().should.be.rejectedWith(/Vault has not been initialized/);
  });

  it('should be rejected with Error - missing token', function () {
    myVault.headers = {};
    return myVault.seal().should.be.rejectedWith(/Missing auth token/);
  });

  it('should resolve to binded instance - success', function () {
    var existing = _.cloneDeep(myVault.status);
    return myVault.seal({token: myVault.token}).then(function (self) {
      existing.should.have.property('sealed');
      existing.sealed.should.be.false;
      self.status.should.have.property('sealed');
      self.status.sealed.should.be.true;
    });
  });

  it('should resolve to binded instance - already sealed', function () {
    var existing = _.cloneDeep(myVault.status);
    return myVault.seal({token: myVault.token}).then(function (self) {
      existing.should.have.property('sealed');
      existing.sealed.should.be.true;
      self.status.should.have.property('sealed');
      self.status.sealed.should.be.true;
    });
  });

  after(function () {
    myVault.disableListeners();
  });
});
