require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  chai = helpers.chai,
  assert = helpers.assert,
  Vault = require('../lib/vaulted.js');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;

describe('init', function() {
  var myVault = null;

  before(function() {
    myVault = new Vault({
      vault_host: VAULT_HOST,
      vault_port: VAULT_PORT,
      vault_ssl: 0
    });
    return myVault.prepare();
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
    }).then(null, function (err) {
      debuglog(err);
      assert.notOk(err, 'no error should ever be returned');
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