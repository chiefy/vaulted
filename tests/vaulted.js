require('./helpers.js').should;

var Vault = require('../lib/vaulted.js');

describe('Vaulted', function() {

  describe('#constructor', function() {

    var old_VAULT_ADDR = null;

    before(function() {
      if (process.env.VAULT_ADDR) {
        old_VAULT_ADDR = process.env.VAULT_ADDR;
        delete process.env.VAULT_ADDR;
      }
    });

    after(function() {
      if (old_VAULT_ADDR) {
        process.env.VAULT_ADDR = old_VAULT_ADDR;
      }
    });

    it('should create a new instance', function() {
      var vault = new Vault();
      vault.should.be.instanceof(Vault);
    });

    it('should take an empty options hash', function() {
      var vault = new Vault({});
      vault.should.be.an.instanceof(Vault);
    });

    it('should take an options hash, and override any default settings', function() {
      var
        options = {
          'vault_url': 'https://some.other.host:1234',
          'env': 'test'
        },
        vault = new Vault(options),
        env = vault.config.get('env');

      env.should.equal(options.env);
    });

    it('should throw an error when it can\'t find an api definition', function() {
      function shouldThrow() {
        return new Vault({
          'prefix': 'vdfsdf4'
        });
      }
      shouldThrow.should.throw(Error);
    });

    it('should be in the sealed state by default', function () {
      var vault = new Vault();
      vault.status.sealed.should.be.true;
    });

  });

});



