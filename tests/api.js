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

  describe('#constructor', function() {

    it('should throw when no params are sent', function () {
      (function() {
        new API();
      }).should.throw(/API must be instantiated with a node-convict based object/);
    });

  });

  describe('#getEndpoint', function() {
    var myAPI = null;

    before(function () {
      myAPI = new API(config);
    });

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

  describe('#_loadAPIDefinitions', function() {
    var myconfig;

    beforeEach(function () {
        myconfig = require('../lib/config')();
    });

    it('should load a well formed YAML doc with the correct filename', function () {
      var result = API.prototype._loadAPIDefinitions.call(null, myconfig);
      result.should.exist;
      result.should.include.keys('auth/token/create');
    });

    it('with proxy configuration', function () {
      var options = {
        proxy_address: 'abc.example.com',
        proxy_port: 443,
        vault_ssl: true
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('proxy');
      result['auth/token/create']['defaults']['proxy'].should.be.equal('https://abc.example.com:443');
    });

    it('with proxy configuration - insecure', function () {
      var options = {
        proxy_address: 'abc.example.com',
        proxy_port: 8000,
        vault_ssl: false
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('proxy');
      result['auth/token/create']['defaults']['proxy'].should.be.equal('http://abc.example.com:8000');
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
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('proxy');
      result['auth/token/create']['defaults']['proxy'].should.be.equal('https://dummy:pass@abc.example.com:443');
    });

    it('with ssl configuration - cacert', function () {
      var options = {
        ssl_ca_cert: path.join(__dirname, 'configs', 'ca.cert.pem')
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var cacert = fs.readFileSync(testcfg.get('ssl_ca_cert'));
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('ca');
      result['auth/token/create']['defaults']['ca'].should.be.eql(cacert);
    });

    it('with ssl configuration - cert and key', function () {
      var options = {
        ssl_cert_file: path.join(__dirname, 'configs', 'client.crt'),
        ssl_pem_file: path.join(__dirname, 'configs', 'client.key')
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var clientcert = fs.readFileSync(testcfg.get('ssl_cert_file'));
      var clientkey = fs.readFileSync(testcfg.get('ssl_pem_file'));
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('cert');
      result['auth/token/create']['defaults']['cert'].should.be.eql(clientcert);
      result['auth/token/create']['defaults'].should.include.keys('key');
      result['auth/token/create']['defaults']['key'].should.be.eql(clientkey);
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
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('cert');
      result['auth/token/create']['defaults']['cert'].should.be.eql(clientcert);
      result['auth/token/create']['defaults'].should.include.keys('key');
      result['auth/token/create']['defaults']['key'].should.be.eql(clientkey);
      result['auth/token/create']['defaults'].should.include.keys('passphrase');
      result['auth/token/create']['defaults']['passphrase'].should.be.equal('fakephrase');
    });

    it('with timeout specified', function () {
      var options = {
        timeout: 10
      };
      var testcfg = config.util.extendDeep(myconfig, options);
      var result = API.prototype._loadAPIDefinitions.call(null, testcfg);
      result.should.exist;
      result.should.include.keys('auth/token/create');
      result['auth/token/create'].should.include.keys('defaults');
      result['auth/token/create']['defaults'].should.include.keys('timeout');
      result['auth/token/create']['defaults']['timeout'].should.be.equal(10);
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

