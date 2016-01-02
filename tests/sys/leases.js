'use strict';
require('../helpers').should;

var
  _ = require('lodash'),
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  expect = helpers.expect;

chai.use(helpers.cap);


describe('leases', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;

  before('prepare environment for leases', function () {
    var genRoot = function () {
      return myVault.genRootInternal({
        body: {
          common_name: 'myvault.com'
        }
      });
    };

    var configUrls = function () {
      return myVault.setConfigUrls({
        body: {
          issuing_certificates: 'http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/ca',
          crl_distribution_points: 'http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/crl'
        }
      });
    };

    var createRole = function () {
      return myVault.createCertRole({
        id: 'example-dot-com',
        body: {
          allowed_domains: 'example.com',
          allow_subdomains: true,
          max_ttl: '72h'
        }
      });
    };

    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      return myVault.mountPki().bind(myVault)
        .then(genRoot)
        .then(configUrls)
        .then(createRole);
    });
  });

  describe('#renewLease', function () {

    before(function () {
      return myVault.mountConsul();
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.renewLease({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.renewLease()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.renewLease({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.renewLease({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if invalid id option provided', function () {
      return myVault.renewLease({
        id: 'abcxyz'
      }).catch(function (err) {
        debuglog('renewLease error: ', err);
        expect(err).to.not.be.undefined;
        err.should.have.property('statusCode');
        err.statusCode.should.equal(400);
        err.error.errors[0].should.equal('lease not found or lease is not renewable');
      });
    });

    it('should resolve with renewed secret', function () {
      return helpers.getToken(myVault)
        .then(function (cert) {
          debuglog('cert:', cert);
          return myVault.renewLease({
            id: cert.lease_id
          }).should.be.resolved;
        });

    });

    after(function () {
      return myVault.deleteMount({
        id: 'consul'
      });
    });
  });

  describe('#revokeLease', function () {
    var leaseid = null;

    beforeEach(function () {
      return myVault.issueCertCredentials({
        id: 'example-dot-com',
        body: {
          common_name: 'blah.example.com'
        }
      }).then(function (cert) {
        leaseid = cert.lease_id;
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeLease({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.revokeLease()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.revokeLease({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.revokeLease({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve if all required inputs provided', function () {
      return myVault.revokeLease({
        id: leaseid
      }).should.be.resolved;
    });

  });

  describe('#revokeLeasePrefix', function () {

    beforeEach(function () {
      return myVault.issueCertCredentials({
        id: 'example-dot-com',
        body: {
          common_name: 'blah.example.com'
        }
      });
    });

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeLeasePrefix({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.revokeLeasePrefix()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.revokeLeasePrefix({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.revokeLeasePrefix({
        id: ''
      }).should.be.rejectedWith(/requires an id/);
    });

    it('should resolve if all required inputs provided', function () {
      return myVault.revokeLeasePrefix({
        id: 'pki/issue/example-dot-com/'
      }).should.be.resolved;
    });
  });

  after(function () {
    return myVault.deleteMount({
      id: 'pki'
    });
  });

});
