require('../helpers').should;

var
  fs = require('fs'),
  path = require('path'),
  helpers = require('../helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect;

chai.use(helpers.cap);

describe('pki', function () {
  var newVault = helpers.getEmptyVault();
  var myVault;
  var serialNumber;

  before(function () {
    return helpers.getReadyVault().then(function (vault) {
      myVault = vault;
      return myVault.mountPki();
    });
  });

  describe('#genRootInternal', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.genRootInternal({
        body: {
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.genRootInternal()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.genRootInternal({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.genRootInternal({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no common_name provided in body', function () {
      return myVault.genRootInternal({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.genRootInternal({
        body: {
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.genRootInternal({
        body: {
          common_name: 'mytest.com'
        }
      }).then(function (cert) {
        debuglog(cert);
        expect(cert).not.to.be.undefined;
        cert.should.have.property('lease_id');
        cert.should.have.property('renewable');
        cert.should.have.property('lease_duration');
        cert.should.have.property('data');
        expect(cert.data).not.to.be.undefined;
        expect(cert.data).not.to.be.null;
        cert.data.should.have.property('certificate');
        expect(cert.data.certificate).not.to.be.undefined;
        expect(cert.data.certificate).not.to.be.null;
        cert.data.should.have.property('expiration');
        expect(cert.data.expiration).not.to.be.undefined;
        expect(cert.data.expiration).not.to.be.null;
        cert.data.should.have.property('issuing_ca');
        expect(cert.data.issuing_ca).not.to.be.undefined;
        expect(cert.data.issuing_ca).not.to.be.null;
        cert.data.should.have.property('serial_number');
        expect(cert.data.serial_number).not.to.be.undefined;
        expect(cert.data.serial_number).not.to.be.null;
      });
    });

  });

  describe('#setConfigCrl', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setConfigCrl().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.setConfigCrl().should.be.fullfilled;
    });

  });

  describe('#getCaDer', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCaDer().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCaDer().then(function (cert) {
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.be.a('string');
      });
    });

  });

  describe('#getCertCa', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCertCa().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCertCa().then(function (cert) {
        debuglog(cert);
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.have.property('data');
        expect(cert.data).not.to.be.undefined;
        expect(cert.data).not.to.be.null;
        cert.data.should.have.property('certificate');
        expect(cert.data.certificate).not.to.be.undefined;
        expect(cert.data.certificate).not.to.be.null;
      });
    });

  });

  describe('#getCertCrl', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCertCrl().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCertCrl().then(function (cert) {
        debuglog(cert);
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.have.property('data');
        expect(cert.data).not.to.be.undefined;
        expect(cert.data).not.to.be.null;
        cert.data.should.have.property('certificate');
        expect(cert.data.certificate).not.to.be.undefined;
        expect(cert.data.certificate).not.to.be.null;
      });
    });

  });

  describe('#getConfigCrl', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getConfigCrl().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getConfigCrl().then(function (crl) {
        debuglog(crl);
        expect(crl).not.to.be.undefined;
        expect(crl).not.to.be.null;
        crl.should.have.property('data');
        expect(crl.data).not.to.be.undefined;
        expect(crl.data).not.to.be.null;
        crl.data.should.have.property('expiry');
        expect(crl.data.expiry).not.to.be.undefined;
        expect(crl.data.expiry).not.to.be.null;
      }).catch(function (err) {
        debuglog(err);
        expect(err).to.be.undefined;
      });
    });

  });

  describe('#getCrlDer', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCrlDer().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCrlDer().then(function (cert) {
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.be.a('string');
      });
    });

  });

  describe('#getCrlPem', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCrlPem().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCrlPem().then(function (cert) {
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.be.a('string');
      });
    });

  });

  describe('#getCrlRotate', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCrlRotate().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCrlRotate().then(function (crl) {
        debuglog(crl);
        expect(crl).not.to.be.undefined;
        expect(crl).not.to.be.null;
        crl.should.have.property('data');
        expect(crl.data).not.to.be.undefined;
        expect(crl.data).not.to.be.null;
        crl.data.should.have.property('success');
        expect(crl.data.success).not.to.be.undefined;
        expect(crl.data.success).not.to.be.null;
      });
    });

  });

  describe('#genRootExported', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.genRootExported({
        body: {
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.genRootExported()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.genRootExported({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.genRootExported({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no common_name provided in body', function () {
      return myVault.genRootExported({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.genRootExported({
        body: {
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.genRootExported({
        body: {
          common_name: 'mysample.com'
        }
      }).then(function (cert) {
        debuglog(cert);
        expect(cert).should.not.be.undefined;
        cert.should.have.property('lease_id');
        cert.should.have.property('renewable');
        cert.should.have.property('lease_duration');
        cert.should.have.property('data');
        expect(cert.data).not.to.be.undefined;
        expect(cert.data).not.to.be.null;
        cert.data.should.have.property('certificate');
        expect(cert.data.certificate).not.to.be.undefined;
        expect(cert.data.certificate).not.to.be.null;
        cert.data.should.have.property('expiration');
        expect(cert.data.expiration).not.to.be.undefined;
        expect(cert.data.expiration).not.to.be.null;
        cert.data.should.have.property('issuing_ca');
        expect(cert.data.issuing_ca).not.to.be.undefined;
        expect(cert.data.issuing_ca).not.to.be.null;
        cert.data.should.have.property('private_key');
        expect(cert.data.private_key).not.to.be.undefined;
        expect(cert.data.private_key).not.to.be.null;
        cert.data.should.have.property('private_key_type');
        expect(cert.data.private_key_type).not.to.be.undefined;
        expect(cert.data.private_key_type).not.to.be.null;
        cert.data.should.have.property('serial_number');
        expect(cert.data.serial_number).not.to.be.undefined;
        expect(cert.data.serial_number).not.to.be.null;
      });
    });

  });

  describe('#setConfigUrls', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setConfigUrls().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.setConfigUrls({
        body: {
          issuing_certificates: 'http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/ca',
          crl_distribution_points: 'http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/crl'
        }
      }).should.be.fullfilled;

    });

  });

  describe('#getCaPem', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCaPem().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCaPem().then(function (cert) {
        expect(cert).not.to.be.undefined;
        expect(cert).not.to.be.null;
        cert.should.be.a('string');
      });
    });

  });

  describe('#getConfigUrls', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getConfigUrls().should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getConfigUrls().then(function (res) {
        expect(res).not.to.be.undefined;
        res.should.have.property('data');
        expect(res.data).not.to.be.undefined;
        expect(res.data).not.to.be.null;
        res.data.should.have.property('issuing_certificates');
        expect(res.data.issuing_certificates).not.to.be.undefined;
        expect(res.data.issuing_certificates).not.to.be.null;
        res.data.issuing_certificates.should.contain('http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/ca');
        res.data.should.have.property('crl_distribution_points');
        expect(res.data.crl_distribution_points).not.to.be.undefined;
        expect(res.data.crl_distribution_points).not.to.be.null;
        res.data.crl_distribution_points.should.contain('http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT + '/v1/pki/crl');
        res.data.should.have.property('ocsp_servers');
        expect(res.data.ocsp_servers).not.to.be.undefined;
        expect(res.data.ocsp_servers).not.to.be.null;
      }).catch(function (err) {
        debuglog(err);
        expect(err).to.be.undefined;
      });
    });

  });

  describe('#createCertRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.createCertRole({
        id: 'mysample-dot-com'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.createCertRole()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.createCertRole({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.createCertRole({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.createCertRole({
        id: 'sample-dot-com',
        body: {
          allowed_domains: 'mysample.com',
          allow_subdomains: true,
          max_ttl: '72h'
        }
      }).should.be.fullfilled;
    });

  });

  describe('#getCertRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCertRole({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.getCertRole()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.getCertRole({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.getCertRole({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCertRole({
        id: 'sample-dot-com'
      }).then(function (role) {
        debuglog(role);
        expect(role).not.to.be.undefined;
        role.should.have.property('data');
        expect(role.data).not.to.be.undefined;
        expect(role.data).not.to.be.null;
        role.data.should.have.property('allow_any_name');
        expect(role.data.allow_any_name).not.to.be.undefined;
        expect(role.data.allow_any_name).not.to.be.null;
        role.data.should.have.property('allow_ip_sans');
        expect(role.data.allow_ip_sans).not.to.be.undefined;
        expect(role.data.allow_ip_sans).not.to.be.null;
        role.data.should.have.property('allow_localhost');
        expect(role.data.allow_localhost).not.to.be.undefined;
        expect(role.data.allow_localhost).not.to.be.null;
        role.data.should.have.property('allow_subdomains');
        expect(role.data.allow_subdomains).not.to.be.undefined;
        expect(role.data.allow_subdomains).not.to.be.null;
        role.data.allow_subdomains.should.be.true;
        role.data.should.have.property('allowed_domains');
        expect(role.data.allowed_domains).not.to.be.undefined;
        expect(role.data.allowed_domains).not.to.be.null;
        role.data.allowed_domains.should.contain('mysample.com');
        role.data.should.have.property('client_flag');
        expect(role.data.client_flag).not.to.be.undefined;
        expect(role.data.client_flag).not.to.be.null;
        role.data.should.have.property('code_signing_flag');
        expect(role.data.code_signing_flag).not.to.be.undefined;
        expect(role.data.code_signing_flag).not.to.be.null;
        role.data.should.have.property('key_bits');
        expect(role.data.key_bits).not.to.be.undefined;
        expect(role.data.key_bits).not.to.be.null;
        role.data.should.have.property('key_type');
        expect(role.data.key_type).not.to.be.undefined;
        expect(role.data.key_type).not.to.be.null;
        role.data.should.have.property('ttl');
        expect(role.data.ttl).not.to.be.undefined;
        expect(role.data.ttl).not.to.be.null;
        role.data.should.have.property('max_ttl');
        expect(role.data.max_ttl).not.to.be.undefined;
        expect(role.data.max_ttl).not.to.be.null;
        role.data.max_ttl.should.be.equal('72h');
        role.data.should.have.property('server_flag');
        expect(role.data.server_flag).not.to.be.undefined;
        expect(role.data.server_flag).not.to.be.null;
      });
    });

  });

  describe('#issueCertCredentials', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.issueCertCredentials({
        id: 'other-dot-com',
        body: {
          common_name: 'blah.other.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.issueCertCredentials()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.issueCertCredentials({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.issueCertCredentials({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.issueCertCredentials({
          id: 'fake'
        })
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.issueCertCredentials({
        id: 'fake',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no common_name provided in body', function () {
      return myVault.issueCertCredentials({
        id: 'fake',
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.issueCertCredentials({
        id: 'fake',
        body: {
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.issueCertCredentials({
        id: 'sample-dot-com',
        body: {
          common_name: 'blah.mysample.com'
        }
      }).then(function (cert) {
        debuglog(cert);
        expect(cert).should.not.be.undefined;
        cert.should.have.property('lease_id');
        cert.should.have.property('renewable');
        cert.should.have.property('lease_duration');
        cert.should.have.property('data');
        expect(cert.data).not.to.be.undefined;
        expect(cert.data).not.to.be.null;
        cert.data.should.have.property('certificate');
        expect(cert.data.certificate).not.to.be.undefined;
        expect(cert.data.certificate).not.to.be.null;
        cert.data.should.have.property('issuing_ca');
        expect(cert.data.issuing_ca).not.to.be.undefined;
        expect(cert.data.issuing_ca).not.to.be.null;
        cert.data.should.have.property('private_key');
        expect(cert.data.private_key).not.to.be.undefined;
        expect(cert.data.private_key).not.to.be.null;
        cert.data.should.have.property('private_key_type');
        expect(cert.data.private_key_type).not.to.be.undefined;
        expect(cert.data.private_key_type).not.to.be.null;
        cert.data.should.have.property('serial_number');
        expect(cert.data.serial_number).not.to.be.undefined;
        expect(cert.data.serial_number).not.to.be.null;
        serialNumber = cert.data.serial_number;
      });
    });

  });

  describe('#getCertSerial', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.getCertSerial({
        id: 'fake-serial'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.getCertSerial()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.getCertSerial({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.getCertSerial({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.getCertSerial({
        id: serialNumber
      }).then(function (serialCert) {
        debuglog(serialCert);
        expect(serialCert).should.not.be.undefined;
        serialCert.should.have.property('lease_id');
        serialCert.should.have.property('renewable');
        serialCert.should.have.property('lease_duration');
        serialCert.should.have.property('data');
        expect(serialCert.data).not.to.be.undefined;
        expect(serialCert.data).not.to.be.null;
        serialCert.data.should.have.property('certificate');
        expect(serialCert.data.certificate).not.to.be.undefined;
        expect(serialCert.data.certificate).not.to.be.null;
      });
    });

  });

  describe('#revokeCertCredentials', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.revokeCertCredentials({
        body: {
          serial_number: 'fake-serial'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.revokeCertCredentials()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.revokeCertCredentials({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.revokeCertCredentials({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no serial_number provided in body', function () {
      return myVault.revokeCertCredentials({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty serial_number provided in body', function () {
      return myVault.revokeCertCredentials({
        body: {
          serial_number: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.revokeCertCredentials({
        body: {
          serial_number: serialNumber
        }
      }).then(function (res) {
        debuglog(res);
        expect(res).should.not.be.undefined;
        res.should.have.property('data');
        expect(res.data).not.to.be.undefined;
        expect(res.data).not.to.be.null;
        res.data.should.have.property('revocation_time');
        expect(res.data.revocation_time).not.to.be.undefined;
        expect(res.data.revocation_time).not.to.be.null;
      });
    });

  });

  describe('#deleteCertRole', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.deleteCertRole({
        id: 'fake'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.deleteCertRole()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.deleteCertRole({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.deleteCertRole({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.deleteCertRole({
        id: 'sample-dot-com'
      }).should.be.fullfilled;
    });

  });

  describe('#genIntermediatesInternal', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.genIntermediatesInternal({
        body: {
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.genIntermediatesInternal()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.genIntermediatesInternal({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.genIntermediatesInternal({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no common_name provided in body', function () {
      return myVault.genIntermediatesInternal({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.genIntermediatesInternal({
        body: {
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.mountPki({
        id: 'other-int'
      }).then(function () {
        return myVault.genIntermediatesInternal({
          body: {
            common_name: 'mytest.com'
          }
        }, 'other-int').then(function (cert) {
          debuglog(cert);
          expect(cert).not.to.be.undefined;
          cert.should.have.property('lease_id');
          cert.should.have.property('renewable');
          cert.should.have.property('lease_duration');
          cert.should.have.property('data');
          expect(cert.data).not.to.be.undefined;
          expect(cert.data).not.to.be.null;
          cert.data.should.have.property('csr');
          expect(cert.data.csr).not.to.be.undefined;
          expect(cert.data.csr).not.to.be.null;
        });
      }).finally(function () {
        return myVault.deleteMount({
          id: 'other-int'
        }).catch(function (err) {
          debuglog('deleteMount pki failed:', err);
        });
      });
    });

  });

  describe('#genIntermediatesExported', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.genIntermediatesExported({
        body: {
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.genIntermediatesExported()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.genIntermediatesExported({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.genIntermediatesExported({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no common_name provided in body', function () {
      return myVault.genIntermediatesExported({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.genIntermediatesExported({
        body: {
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided', function () {
      return myVault.mountPki({
        id: 'other-ext'
      }).then(function () {
        return myVault.genIntermediatesExported({
          body: {
            common_name: 'mysample.com'
          }
        }, 'other-ext').then(function (cert) {
          debuglog(cert);
          expect(cert).should.not.be.undefined;
          cert.should.have.property('lease_id');
          cert.should.have.property('renewable');
          cert.should.have.property('lease_duration');
          cert.should.have.property('data');
          expect(cert.data).not.to.be.undefined;
          expect(cert.data).not.to.be.null;
          cert.data.should.have.property('csr');
          expect(cert.data.csr).not.to.be.undefined;
          expect(cert.data.csr).not.to.be.null;
          cert.data.should.have.property('private_key');
          expect(cert.data.private_key).not.to.be.undefined;
          expect(cert.data.private_key).not.to.be.null;
          cert.data.should.have.property('private_key_type');
          expect(cert.data.private_key_type).not.to.be.undefined;
          expect(cert.data.private_key_type).not.to.be.null;
        });
      }).finally(function () {
        return myVault.deleteMount({
          id: 'other-ext'
        }).catch(function (err) {
          debuglog('deleteMount pki failed:', err);
        });
      });
    });

  });

  describe('#setSignedIntermediates', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setSignedIntermediates({
        body: {
          certificate: 'fakecert'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.setSignedIntermediates()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.setSignedIntermediates({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.setSignedIntermediates({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no certificate provided in body', function () {
      return myVault.setSignedIntermediates({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty certificate provided in body', function () {
      return myVault.setSignedIntermediates({
        body: {
          certificate: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it.skip('should resolve when all required and valid inputs provided', function () {
      // always returns 400 no data found
      return myVault.mountPki({
        id: 'temp'
      }).then(function () {
        return myVault.genIntermediatesExported({
          body: {
            common_name: 'mysample.com'
          }
        }, 'temp').then(function (cert) {
          debuglog(cert);
          return myVault.setSignedIntermediates({
            body: {
              certificate: cert.data.private_key + '\\n' + cert.data.csr
            }
          }).catch(function (err) {
            debuglog(err);
            expect(err).to.be.undefined;
          });
          //.should.be.fullfilled;
        });
      }).finally(function () {
        return myVault.deleteMount({
          id: 'temp'
        }).catch(function (err) {
          debuglog('deleteMount pki failed:', err);
        });
      });

    });

  });

  describe('#signIntermediateWithRoot', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.signIntermediateWithRoot({
        body: {
          csr: 'abcxyz',
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.signIntermediateWithRoot()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.signIntermediateWithRoot({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.signIntermediateWithRoot({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no csr provided in body', function () {
      return myVault.signIntermediateWithRoot({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty csr provided in body', function () {
      return myVault.signIntermediateWithRoot({
        body: {
          csr: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.signIntermediateWithRoot({
        body: {
          csr: 'abcxyz',
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided');

  });

  describe('#signCertificate', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.signCertificate({
        id: 'fake',
        body: {
          csr: 'abcxyz',
          common_name: 'fake.com'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.signCertificate()
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no id provided', function () {
      return myVault.signCertificate({})
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if empty id provided', function () {
      return myVault.signCertificate({
          id: ''
        })
        .should.be.rejectedWith(/requires an id/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.signCertificate({
          id: 'fake'
        })
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.signCertificate({
        id: 'fake',
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no csr provided in body', function () {
      return myVault.signCertificate({
        id: 'fake',
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty csr provided in body', function () {
      return myVault.signCertificateVerbatim({
        id: 'fake',
        body: {
          csr: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty common_name provided in body', function () {
      return myVault.signCertificate({
        id: 'fake',
        body: {
          csr: 'abcxyz',
          common_name: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided');

  });

  describe('#signCertificateVerbatim', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.signCertificateVerbatim({
        body: {
          csr: 'fakecsr'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.signCertificateVerbatim()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.signCertificateVerbatim({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.signCertificateVerbatim({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no csr provided in body', function () {
      return myVault.signCertificateVerbatim({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty csr provided in body', function () {
      return myVault.signCertificateVerbatim({
        body: {
          csr: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should resolve when all required and valid inputs provided');

  });

  describe('#setConfigCa', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      return newVault.setConfigCa({
        body: {
          pem_bundle: 'fakebundledstring'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options', function () {
      return myVault.setConfigCa()
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no body provided', function () {
      return myVault.setConfigCa({})
        .should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty body provided', function () {
      return myVault.setConfigCa({
        body: null
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if no pem_bundle provided in body', function () {
      return myVault.setConfigCa({
        body: {}
      }).should.be.rejectedWith(/Missing required input/);
    });

    it('should reject with an Error if empty pem_bundle provided in body', function () {
      return myVault.setConfigCa({
        body: {
          pem_bundle: ''
        }
      }).should.be.rejectedWith(/Missing required input/);
    });

    it.skip('should resolve when all required and valid inputs provided', function () {
      // keeps returning a 400 - no data found
      return myVault.mountPki({
        id: 'rooty'
      }).then(function () {
        return myVault.setConfigCa({
          body: {
            pem_bundle: fs.readFileSync(path.resolve(path.join(__dirname, '..', 'configs', 'formatted-rootca.pem')), 'ascii')
          }
        }, 'rooty').then(function () {
          assert.ok(true, 'should have been successful');
        }).catch(function (err) {
          debuglog(err);
          expect(err).to.be.undefined;
        }).finally(function () {
          return myVault.deleteMount({
            id: 'rooty'
          }).catch(function (err) {
            debuglog('deleteMount pki failed:', err);
          });
        });
        //.should.be.fullfilled;
      });
    });

  });

  after(function () {
    return myVault.deleteMount({
      id: 'pki'
    }).catch(function (err) {
      debuglog('deleteMount pki failed:', err);
    });
  });

});
