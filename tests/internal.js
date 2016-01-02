'use strict';
require('./helpers').should;

var
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  assert = helpers.assert,
  expect = helpers.expect,
  internal = require('../lib/internal');

chai.use(helpers.cap);

var BACKUP_DIR = path.join(os.homedir(), '.vault');
var BACKUP_FILE = path.join(BACKUP_DIR, 'keys.json');

var renameFile = function (oldname, newname) {
  try {
    fs.renameSync(path.join(BACKUP_DIR, oldname), path.join(BACKUP_DIR, newname));
  } catch (err) {
    debuglog('failed to rename %s to %s: %s', oldname, newname, err);
  }
};

var initOrRename = function (vault) {
  return vault.getInitStatus().then(function (result) {
    debuglog('initOrRename result status: %s', result.initialized);
    if (!result.initialized) {
      return vault.init();
    } else {
      renameFile('prev-keys.json', 'keys.json');
      return internal.recover(vault);
    }
  });

};


describe('internal state', function () {
  var myVault = helpers.getVault();

  describe('#loadState', function () {

    it('not initialized', function () {
      renameFile('keys.json', 'prev-keys.json');
      return internal.loadState(myVault).then(function (self) {
        self.initialized.should.be.false;
        myVault.initialized.should.be.false;
        self.keys.should.be.empty;
        myVault.keys.should.be.empty;
      });
    });

    it('initialized', function () {
      return initOrRename(myVault).then(function () {
        return internal.loadState(myVault).then(function (self) {
          self.initialized.should.be.true;
          myVault.initialized.should.be.true;
        });
      });
    });

    it('unsealed', function () {
      return myVault.unSeal().then(function () {
        return internal.loadState(myVault).then(function (self) {
          self.initialized.should.be.true;
          myVault.initialized.should.be.true;
          self.status.sealed.should.be.false;
          myVault.status.sealed.should.be.false;
        });
      });
    });

    it('default mounts only', function () {
      return internal.loadState(myVault).then(function (self) {
        self.initialized.should.be.true;
        myVault.initialized.should.be.true;
        self.status.sealed.should.be.false;
        myVault.status.sealed.should.be.false;
        self.mounts.should.not.be.empty;
        myVault.mounts.should.not.be.empty;
        self.mounts.should.contain.keys('sys/');
        myVault.mounts.should.contain.keys('sys/');
      });
    });

    it('consul mounted', function () {
      return myVault.mountConsul().then(function () {
        return internal.loadState(myVault).then(function (self) {
          self.initialized.should.be.true;
          myVault.initialized.should.be.true;
          self.status.sealed.should.be.false;
          myVault.status.sealed.should.be.false;
          self.mounts.should.not.be.empty;
          myVault.mounts.should.not.be.empty;
          self.mounts.should.contain.keys('consul/');
          myVault.mounts.should.contain.keys('consul/');
        });
      });
    });

    it('initialized with no backup', function () {
      renameFile('keys.json', 'prev-keys.json');
      myVault.keys = [];
      return internal.loadState(myVault).then(function (self) {
        self.initialized.should.be.true;
        myVault.initialized.should.be.true;
        self.keys.should.be.empty;
        myVault.keys.should.be.empty;
      });
    });

  });

  describe('#backup', function () {

    it('no data', function () {
      myVault.token = null;
      myVault.keys = [];
      return internal.backup(myVault).then(function () {
        try {
          var stats = fs.statSync(BACKUP_FILE);
          assert.notOk(stats, 'file should not exist');
        } catch (err) {
          err.should.be.an.instanceof(Error);
          err.code.should.equal('ENOENT');
        }
      });
    });

    it('keys not Array', function () {
      myVault.keys = null;
      return internal.backup(myVault).then(function () {
        try {
          var stats = fs.statSync(BACKUP_FILE);
          assert.notOk(stats, 'file should not exist');
        } catch (err) {
          err.should.be.an.instanceof(Error);
          err.code.should.equal('ENOENT');
        }
        myVault.keys = [];
      });
    });

    it('keys empty Array', function () {
      return internal.backup(myVault).then(function () {
        try {
          var stats = fs.statSync(BACKUP_FILE);
          assert.notOk(stats, 'file should not exist');
        } catch (err) {
          err.should.be.an.instanceof(Error);
          err.code.should.equal('ENOENT');
        }
      });
    });

    it('success', function () {
      return initOrRename(myVault).then(function () {
        return internal.backup(myVault).then(function () {
          try {
            var stats = fs.statSync(BACKUP_FILE);
            debuglog(stats);
            debuglog(stats.isFile());
            stats.isFile().should.be.true;
          } catch (err) {
            debuglog(err);
            assert.notOk(err, 'backup file failed for some reason');
          }
        });
      });
    });

  });

  describe('#recover', function () {

    it('no file', function () {
      myVault.config = myVault.config.util.extendDeep(myVault.config, {
        backup_dir: BACKUP_DIR
      });
      renameFile('keys.json', 'prev-keys.json');
      myVault.token = null;
      myVault.keys = [];
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.be.null;
        expect(myVault.keys).to.be.empty;
      });
    });

    it('invalid file data', function () {
      var data = '{"root"}';
      fs.writeFileSync(BACKUP_FILE, data);
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.be.null;
        expect(myVault.keys).to.be.empty;
      });
    });

    it('no root token', function () {
      var data = JSON.stringify({
        'keys': []
      });
      fs.writeFileSync(BACKUP_FILE, data);
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.be.null;
        expect(myVault.keys).to.be.empty;
      });
    });

    it('keys not Array', function () {
      var data = JSON.stringify({
        'root': 'xyz',
        'keys': 'abc,xyz'
      });
      fs.writeFileSync(BACKUP_FILE, data);
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.be.null;
        expect(myVault.keys).to.be.empty;
      });
    });

    it('keys empty Array', function () {
      var data = JSON.stringify({
        'root': 'xyz',
        'keys': []
      });
      fs.writeFileSync(BACKUP_FILE, data);
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.be.null;
        expect(myVault.keys).to.be.empty;
      });
    });

    it('success', function () {
      fs.unlinkSync(BACKUP_FILE);
      renameFile('prev-keys.json', 'keys.json');
      return internal.recover(myVault).then(function () {
        expect(myVault.token).to.not.be.null;
        expect(myVault.keys).to.not.be.empty;
      });
    });

  });

  describe('#syncMounts', function () {
    var aVault;

    beforeEach(function () {
      return helpers.getReadyVault().then(function (vault) {
        aVault = vault;
        return vault.mountConsul({
          id: 'myCon'
        }).then(function () {
          return aVault.createAuthMount({
            id: 'myApp',
            body: {
              type: 'app-id'
            }
          }).then(function () {
            return helpers.getReadyVault().then(function (theVault) {
              aVault = theVault;
            });
          });
        });
      });
    });

    it('sync up mounts', function () {
      expect(aVault.api.endpoints['myCon/config/access']).to.be.undefined;
      expect(aVault.api.endpoints['auth/myApp/login']).to.be.undefined;
      internal.syncMounts(aVault);
      // return Promise.delay(500).then(function () {
      //   expect(aVault.api.endpoints['myCon/config/access']).to.not.be.undefined;
      //   expect(aVault.api.endpoints['auth/myApp/login']).to.not.be.undefined;
      // });
    });

    afterEach(function () {
      return aVault.deleteMount({
        id: 'myCon'
      }).then(function () {
        return aVault.deleteAuthMount({
          id: 'myApp'
        });
      });

    });

  });

  after(function () {
    return myVault.deleteMount({
      id: 'consul'
    });
  });

});
