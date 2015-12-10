require('./helpers').should;

var
  helpers = require('./helpers'),
  chai = helpers.chai,
  Vault = require('../lib/vaulted');

chai.use(helpers.cap);


describe('init', function() {
  var myVault;

  before(function() {
    return helpers.getPreparedVault().then(function (vault) {
      myVault = vault;
    });
  });

  it.skip('initialized false', function () {
    return myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.false;
    });
  });

  it('init successful', function () {
    return myVault.init().then(function (self) {
        self.should.be.an.instanceof(Vault);
        self.initialized.should.be.true;
        self.token.should.not.be.null;
        self.keys.should.not.be.empty;
    });
  });

  it('init - already initialized', function () {
    return myVault.init().then(function (self) {
        self.should.be.an.instanceof(Vault);
        self.initialized.should.be.true;
        self.token.should.not.be.null;
        self.keys.should.not.be.empty;
    });
  });

  it('initialized true', function () {
    return myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.true;
    });
  });

});