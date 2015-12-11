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

  it('loadState - not initialized', function () {
    renameFile('keys.json', 'prev-keys.json');
    return internal.loadState(myVault).then(function (self) {
      self.initialized.should.be.false;
      myVault.initialized.should.be.false;
      self.keys.should.be.empty;
      myVault.keys.should.be.empty;
    });
  });

  it('loadState - sealed', function () {
    return initOrRename(myVault).then(function () {
      return internal.loadState(myVault).then(function (self) {
        self.initialized.should.be.true;
        myVault.initialized.should.be.true;
        self.status.sealed.should.be.true;
        myVault.status.sealed.should.be.true;
      });
    });
  });

  it('loadState - unsealed', function () {
    return myVault.unSeal().then(function () {
      return internal.loadState(myVault).then(function (self) {
        self.initialized.should.be.true;
        myVault.initialized.should.be.true;
        self.status.sealed.should.be.false;
        myVault.status.sealed.should.be.false;
      });
    });
  });

  it('loadState - default mounts only', function () {
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

  it('loadState - consul mounted', function () {
    return myVault.createMount({
      id: 'consul',
      body: {
        type: 'consul'
      }
    }).then(function () {
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

  it('loadState - initialized with no backup', function () {
    renameFile('keys.json', 'prev-keys.json');
    myVault.keys = [];
    return internal.loadState(myVault).then(function (self) {
      self.initialized.should.be.true;
      myVault.initialized.should.be.true;
      self.keys.should.be.empty;
      myVault.keys.should.be.empty;
    });
  });

  it('backup - no data', function () {
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

  it('backup - keys not Array', function () {
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

  it('backup - keys empty Array', function () {
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

  it('backup success', function () {
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

  it('recover - no file', function () {
    renameFile('keys.json', 'prev-keys.json');
    myVault.token = null;
    myVault.keys = [];
    return internal.recover(myVault).then(function () {
      expect(myVault.token).to.be.null;
      expect(myVault.keys).to.be.empty;
    });
  });

  it('recover - invalid file data', function () {
    var data = '{"root"}';
    fs.writeFileSync(BACKUP_FILE, data);
    return internal.recover(myVault).then(function () {
      expect(myVault.token).to.be.null;
      expect(myVault.keys).to.be.empty;
    });
  });

  it('recover - no root token', function () {
    var data = JSON.stringify({
      'keys': []
    });
    fs.writeFileSync(BACKUP_FILE, data);
    return internal.recover(myVault).then(function () {
      expect(myVault.token).to.be.null;
      expect(myVault.keys).to.be.empty;
    });
  });

  it('recover - keys not Array', function () {
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

  it('recover - keys empty Array', function () {
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

  it('recover - success', function () {
    fs.unlinkSync(BACKUP_FILE);
    renameFile('prev-keys.json', 'keys.json');
    return internal.recover(myVault).then(function () {
      expect(myVault.token).to.not.be.null;
      expect(myVault.keys).to.not.be.empty;
    });
  });

  after(function () {
    return myVault.deleteMount({
      id: 'consul'
    }).then(function () {
      if (!myVault.status.sealed) {
        return helpers.resealVault(myVault);
      }
    });
  });
});
