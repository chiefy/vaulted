require('./helpers.js').should;

var
  os = require('os'),
  helpers = require('./helpers'),
  debuglog = require('util').debuglog('vaulted-tests'),
  _ = require('lodash'),
  chai = helpers.chai,
  expect = helpers.expect,
  Vault = require('../lib/vaulted');

chai.use(helpers.cap);

var VAULT_HOST = helpers.VAULT_HOST;
var VAULT_PORT = helpers.VAULT_PORT;


describe('audit', function () {
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

  describe('#enableAudit', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.enableAudit({
        id: 'other',
        body: {
          type: 'file',
          options: {
            'path': '/tmp/'
          }
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.enableAudit()
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.enableAudit({})
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.enableAudit({
        id: ''
      }).should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no body option provided', function () {
      return myVault.enableAudit({
        id: 'abcxyz'
      }).should.be.rejectedWith(/You must provide audit details/);
    });

    it('should reject with an Error if empty body option provided', function () {
      return myVault.enableAudit({
        id: 'abcxyz',
        body: null
      }).should.be.rejectedWith(/You must provide audit details/);
    });

    it('should reject with an Error if option body without type', function () {
      return myVault.enableAudit({
        id: 'abcxyz',
        body: {}
      }).should.be.rejectedWith(/You must provide audit type/);
    });

    it('should reject with an Error if option body with empty type', function () {
      return myVault.enableAudit({
        id: 'abcxyz',
        body: {
          type: ''
        }
      }).should.be.rejectedWith(/You must provide audit type/);
    });

    it('should reject with an Error if required options of specific type not provided', function () {
      return myVault.enableAudit({
        id: 'failfile',
        body: {
          type: 'file'
        }
      }).catch(function (err) {
        err.should.have.property('statusCode');
        err.statusCode.should.be.equal(400);
        err.should.have.property('error');
        err.error.errors.should.include('path is required');
      });
    });

  });

  describe('#enableFileAudit', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.enableFileAudit({
        id: 'other',
        body: {
          'path': '/tmp/'
        }
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.enableFileAudit()
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.enableFileAudit({})
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.enableFileAudit({
        id: ''
      }).should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no body option provided', function () {
      return myVault.enableFileAudit({
        id: 'abcxyz'
      }).should.be.rejectedWith(/You must provide audit details/);
    });

    it('should reject with an Error if empty body option provided', function () {
      return myVault.enableFileAudit({
        id: 'abcxyz',
        body: null
      }).should.be.rejectedWith(/You must provide audit details/);
    });

    it('should reject with an Error if option body without path', function () {
      return myVault.enableFileAudit({
        id: 'abcxyz',
        body: {}
      }).should.be.rejectedWith(/You must provide audit file path/);
    });

    it('should reject with an Error if option body with empty path', function () {
      return myVault.enableFileAudit({
        id: 'abcxyz',
        body: {
          path: ''
        }
      }).should.be.rejectedWith(/You must provide audit file path/);
    });

    it('should resolve', function () {
      return myVault.enableFileAudit({
        id: 'myauditfile',
        body: {
          path: '/var/log/vault'
        }
      }).then(function () {
        return myVault.getAuditMounts().then(function (audits) {
          debuglog(audits);
          expect(audits).to.not.be.undefined;
          audits.should.have.property('myauditfile/');
        });
      });
    });

  });

  describe('#enableSyslogAudit', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.enableSyslogAudit({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.enableSyslogAudit()
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.enableSyslogAudit({})
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.enableSyslogAudit({
        id: ''
      }).should.be.rejectedWith(/You must provide audit id/);
    });

    // unable to test on a windows platform because syslog does not
    // exist on windows
    if (os.platform() !== 'win32') {
      it('should resolve', function () {
        return myVault.enableSyslogAudit({
          id: 'myauditsyslog',
          body: {
            tag: 'testvault'
          }
        }).then(function () {
          return myVault.getAuditMounts().then(function (audits) {
            debuglog(audits);
            expect(audits).to.not.be.undefined;
            audits.should.have.property('myauditsyslog/');
          });
        });
      });
    }

  });

  describe('#getAuditMounts', function () {
    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.getAuditMounts()
        .should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should resolve with list of enabled audit backends', function () {
      return myVault.getAuditMounts().then(function (audits) {
        expect(audits).to.not.be.undefined;
        audits.should.have.property('myauditfile/');

        // unable to test on a windows platform because syslog does not
        // exist on windows
        if (os.platform() !== 'win32') {
          audits.should.have.property('myauditsyslog/');
        }
      }).catch(function (err) {
        debuglog(err);
        expect(err).to.be.undefined;
      });
    });
  });

  describe('#disableAudit', function () {

    it('should reject with an Error if not initialized or unsealed', function () {
      var newVault = new Vault({});
      return newVault.disableAudit({
        id: 'other'
      }).should.be.rejectedWith(/Vault has not been initialized/);
    });

    it('should reject with an Error if no options provided', function () {
      return myVault.disableAudit()
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if no id option provided', function () {
      return myVault.disableAudit({})
        .should.be.rejectedWith(/You must provide audit id/);
    });

    it('should reject with an Error if empty id option provided', function () {
      return myVault.disableAudit({
        id: ''
      }).should.be.rejectedWith(/You must provide audit id/);
    });

    // unable to test on a windows platform because syslog does not
    // exist on windows
    if (os.platform() !== 'win32') {
      it('should resolve with syslog removed', function () {
        return myVault.disableAudit({
          id: 'myauditsyslog'
        }).then(function () {
          return myVault.getAuditMounts().then(function (audits) {
            expect(audits).to.not.be.undefined;
            audits.should.have.property('myauditfile/');
            audits.should.not.have.property('myauditsyslog/');
          });
        });
      });
    }

    it('should resolve with file removed', function () {
      return myVault.disableAudit({
        id: 'myauditfile'
      }).then(function () {
        return myVault.getAuditMounts().then(function (audits) {
          expect(audits).to.not.be.undefined;
          audits.should.be.empty;
          audits.should.not.have.property('myauditfile/');
          audits.should.not.have.property('myauditsyslog/');
        });
      });
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
