require('./helpers.js').should;

var
  chai = require('./helpers').chai,
  config = require('../lib/config.js')(),
  API = require('../lib/api.js');

chai.use(require('./helpers').cap);

describe('API', function() {

  describe('#constructor', function() {

    it('should throw when no params are sent', function () {
      (function() {
        new API();
      }).should.throw(Error);
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
      shouldThrow.should.throw(/Can not get endpoint for non-string value/);
    });

    it('should throw error if endpoint name empty', function () {
      function shouldThrow() {
        myAPI.getEndpoint('');
      }
      shouldThrow.should.throw(/Can not get endpoint for non-string value/);
    });

  });

  describe('#_loadAPIDefinitions', function() {
    var original_config;

    beforeEach(function () {
        original_config = config;
    });

    it('should throw exception if there is no api prefix', function () {
      (function() {
        config.set('prefix', null);
        new API(config);
      }).should.throw(Error);
    });

    afterEach(function () {
      config = original_config;
    });

  });

  describe('#_readConfigFromPath', function() {
    var
      config = require('../lib/config.js')(),
      o_prefix;

    beforeEach(function () {
      o_prefix = config.get('prefix');
    });

    it('should throw exception if the api definition file is missing', function () {
      (function() {
        var bad_path = 'config/asdfasdf.json';
        API.prototype._readConfigFromPath.call(null, config, {}, bad_path);
      }).should.throw(Error);
    });

    it('should throw exception if the api definition file contains invalid JSON', function () {
      (function() {
        var bad_path = 'tests/configs/bad_json.json';
        API.prototype._readConfigFromPath.call(null, config, {}, bad_path);
      }).should.throw('Could not read API definition file');
    });

    it('should load a well formed JSON doc with the correct filename', function () {
        var good_path = 'config/api_auth_token.json';
        var result = API.prototype._readConfigFromPath.call(null, config, {}, good_path);
        result.should.exist;
        result.should.include.keys('auth');
    });

    it('should throw exception if the api prefix is not defined', function () {
      (function() {
        config.set('prefix', 'someprefix');
        new API(config);
      }).should.throw(Error);
    });

    afterEach(function () {
      config.set('prefix', o_prefix);
    });
  });

});

