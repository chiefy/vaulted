require('./helpers.js').should;

var
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  chai = helpers.chai,
  expect = helpers.expect
  Vault = require('../lib/vaulted');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;


describe('leader', function () {
  var myVault;

  before(function () {
    myVault = new Vault({
      // debug: 1,
      vault_host: VAULT_HOST,
      vault_port: VAULT_PORT,
      vault_ssl: 0
    });

    return myVault.prepare().bind(myVault)
    .then(myVault.init)
    .then(myVault.unSeal)
    .catch(function onError(err) {
      debuglog('(before) vault setup failed: %s', err.message);
    });

  });

  it('should resolve with leader information', function () {
    return myVault.getLeader().then(function (leader) {
      debuglog('leader: ', leader);
      expect(leader).to.not.be.undefined;
      leader.should.have.property('ha_enabled');
      leader.ha_enabled.should.be.exist;
      leader.should.have.property('is_self');
      leader.is_self.should.be.exist;
      leader.should.have.property('leader_address');
      leader.leader_address.should.be.exist;
    });
  });

  after(function () {
    if (!myVault.status.sealed) {
      return myVault.seal().then(function () {
        debuglog('vault sealed: %s', myVault.status.sealed);
      }).then(null, function (err) {
        debuglog(err);
        debuglog('failed to seal vault: %s', err.message);
      });
    }
  });

});
