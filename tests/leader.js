require('./helpers').should;

var
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('leader', function () {
  var myVault;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
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
      return helpers.resealVault(myVault);
    }
  });

});
