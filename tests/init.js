require('./helpers.js').should;

var
  chai = require('./helpers').chai,
  Vault = require('../lib/vaulted.js');

chai.use(require('./helpers').cap);

describe('init', function() {
  var myVault = null;

  before(function() {
    myVault = new Vault({vault_ssl: 0});
  });

  it('initialized false', function () {
    myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.false;
    });
  });

  it('init successful', function () {
    myVault.init().then(function (result) {
        result.should.be.an.instanceof(Vault);
    });
  });

  it('init failed - already initialized', function () {
    myVault.init().then(null, function (err) {
        err.should.be.an.instanceof(Error);
    });
  });

  it('initialized true', function () {
    myVault.getInitStatus().then(function (result) {
        result.initialized.should.be.true;
    });
  });

});
