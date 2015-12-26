require('./helpers').should;

var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  helpers = require('./helpers'),
  chai = helpers.chai,
  config = require('../lib/config')(),
  API = require('../lib/api');

chai.use(helpers.cap);


describe('API', function() {
  var myAPI = null;

  before(function () {
    myAPI = new API(config);
  });

  describe('#getEndpoint', function() {

    it('should throw error if no endpoint name provided', function () {
      function shouldThrow() {
        myAPI.getEndpoint();
      }
      shouldThrow.should.throw(/Endpoint not provided or has no length/);
    });

    it('should throw error if endpoint name empty', function () {
      function shouldThrow() {
        myAPI.getEndpoint('');
      }
      shouldThrow.should.throw(/Endpoint not provided or has no length/);
    });

    it('should throw error if endpoint unknown', function () {
      function shouldThrow() {
        myAPI.getEndpoint('sys/fake');
      }
      shouldThrow.should.throw(/Could not find endpoint/);
    });

    it('should return Endpoint for sys/rekey/init', function () {
      var ep = myAPI.getEndpoint('sys/rekey/init');
      ep.should.have.property('get');
      ep.should.have.property('put');
      ep.should.have.property('delete');
    });

  });

  describe('#mountEndpoints', function () {

    it('should thrown when no config', function () {
      (function() {
        myAPI.mountEndpoints();
      }).should.throw(/configuration object not provided/);
    });

    it('should thrown when not config object', function () {
      (function() {
        myAPI.mountEndpoints({});
      }).should.throw(/configuration object not provided/);
    });

    it('should throw when no type', function () {
      (function() {
        myAPI.mountEndpoints(config);
      }).should.throw(/type not provided or has no length/);
    });

    it('should throw when type empty', function () {
      (function() {
        myAPI.mountEndpoints(config, '');
      }).should.throw(/type not provided or has no length/);
    });

    it('should throw when no namespace', function () {
      (function() {
        myAPI.mountEndpoints(config, 'auth');
      }).should.throw(/namespace not provided or has no length/);
    });

    it('should throw when namespace empty', function () {
      (function() {
        myAPI.mountEndpoints(config, 'auth', '');
      }).should.throw(/namespace not provided or has no length/);
    });

  });

  describe('#unmountEndpoints', function () {

    it('should throw when no namespace', function () {
      (function() {
        myAPI.unmountEndpoints();
      }).should.throw(/namespace not provided or has no length/);
    });

    it('should throw when namespace empty', function () {
      (function() {
        myAPI.unmountEndpoints('');
      }).should.throw(/namespace not provided or has no length/);
    });

  });

  describe('#constructor', function() {
    var myconfig;

    beforeEach(function () {
        myconfig = require('../lib/config')();
    });

    it('should throw when no params are sent', function () {
      (function() {
        new API();
      }).should.throw(/API must be configurations object/);
    });

    it('should load a well formed YAML doc with the correct filename', function () {
      var api = new API(myconfig);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
    });

    it('with proxy configuration', function () {
      var options = {
        proxy_address: 'abc.example.com',
        proxy_port: 443,
        vault_ssl: true
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('proxy');
      api.endpoints['auth/token/create']['defaults']['proxy'].should.be.equal('https://abc.example.com:443');
    });

    it('with proxy configuration - insecure', function () {
      var options = {
        proxy_address: 'abc.example.com',
        proxy_port: 8000,
        vault_ssl: false
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('proxy');
      api.endpoints['auth/token/create']['defaults']['proxy'].should.be.equal('http://abc.example.com:8000');
    });

    it('with proxy configuration - with auth', function () {
      var options = {
        proxy_address: 'abc.example.com',
        proxy_port: 443,
        proxy_username: 'dummy',
        proxy_password: 'pass',
        vault_ssl: true
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('proxy');
      api.endpoints['auth/token/create']['defaults']['proxy'].should.be.equal('https://dummy:pass@abc.example.com:443');
    });

    it('with ssl configuration - cacert', function () {
      var options = {
        ssl_ca_cert: path.join(__dirname, 'configs', 'ca.cert.pem')
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var cacert = fs.readFileSync(testcfg.get('ssl_ca_cert'));
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('ca');
      api.endpoints['auth/token/create']['defaults']['ca'].should.be.eql(cacert);
    });

    it('with ssl configuration - cert and key', function () {
      var options = {
        ssl_cert_file: path.join(__dirname, 'configs', 'client.crt'),
        ssl_pem_file: path.join(__dirname, 'configs', 'client.key')
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var clientcert = fs.readFileSync(testcfg.get('ssl_cert_file'));
      var clientkey = fs.readFileSync(testcfg.get('ssl_pem_file'));
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('cert');
      api.endpoints['auth/token/create']['defaults']['cert'].should.be.eql(clientcert);
      api.endpoints['auth/token/create']['defaults'].should.include.keys('key');
      api.endpoints['auth/token/create']['defaults']['key'].should.be.eql(clientkey);
    });

    it('with ssl configuration  - cert and key with passphrase', function () {
      var options = {
        ssl_cert_file: path.join(__dirname, 'configs', 'client.crt'),
        ssl_pem_file: path.join(__dirname, 'configs', 'client.key'),
        ssl_pem_passphrase: 'fakephrase'
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var clientcert = fs.readFileSync(testcfg.get('ssl_cert_file'));
      var clientkey = fs.readFileSync(testcfg.get('ssl_pem_file'));
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('cert');
      api.endpoints['auth/token/create']['defaults']['cert'].should.be.eql(clientcert);
      api.endpoints['auth/token/create']['defaults'].should.include.keys('key');
      api.endpoints['auth/token/create']['defaults']['key'].should.be.eql(clientkey);
      api.endpoints['auth/token/create']['defaults'].should.include.keys('passphrase');
      api.endpoints['auth/token/create']['defaults']['passphrase'].should.be.equal('fakephrase');
    });

    it('with timeout specified', function () {
      var options = {
        timeout: 10
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var api = new API(testcfg);
      api.should.exist;
      api.endpoints.should.include.keys('auth/token/create');
      api.endpoints['auth/token/create'].should.include.keys('defaults');
      api.endpoints['auth/token/create']['defaults'].should.include.keys('timeout');
      api.endpoints['auth/token/create']['defaults']['timeout'].should.be.equal(10);
    });

    afterEach(function () {
      var options = {
        proxy_address: undefined,
        proxy_port: undefined,
        proxy_username: undefined,
        proxy_password: undefined,
        ssl_cert_file: undefined,
        ssl_pem_file: undefined,
        ssl_pem_passphrase: undefined,
        timeout: undefined
      };
      config = config.util.extendDeep(myconfig, options);;
    });

  });

});

