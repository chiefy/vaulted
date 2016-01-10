'use strict';
require('./helpers').should;

var
  fs = require('fs'),
  yaml = require('js-yaml'),
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  chai = helpers.chai,
  Endpoint = require('../lib/endpoint')();

chai.use(helpers.cap);
var BASE_URL = 'http://' + helpers.VAULT_HOST + ':' + helpers.VAULT_PORT;


describe('Endpoint', function () {

  var api_def = yaml.safeLoad(fs.readFileSync('tests/configs/api_test.yml', 'utf8')).v1;

  before(function () {});

  describe('#init', function () {
    var endpoint;

    beforeEach(function () {
      endpoint = new Endpoint({
        base_url: BASE_URL,
        name: 'punts',
        verbs: api_def.punts
      });
    });

    it('should have a name', function () {
      endpoint.should.have.property('name');
      endpoint.name.should.equal('punts');
    });

    it('should have a hash of verbs', function () {
      endpoint.should.have.property('verbs');
      endpoint.verbs.should.be.an.instanceof(Object);
    });

    it('should throw an exception when there are no verbs', function () {
      (function () {
        endpoint = new Endpoint({
          base_url: BASE_URL,
          name: 'sys/bad_def',
          verbs: api_def['sys/bad_def']
        });
      }).should.throw(/has no verbs defined/);
    });

    it('should throw an exception when there is no base_url', function () {
      function shouldThrow() {
        endpoint = new Endpoint({
          name: 'sys/no_get',
          verbs: api_def['sys/no_get']
        });
      }
      shouldThrow.should.throw(/has no base URL defined/);
    });

    it('should throw an exception when no name', function () {
      function shouldThrow() {
        endpoint = new Endpoint();
      }
      shouldThrow.should.throw(/Endpoint has no name defined/);
    });

  });

  describe('#_createRequest', function () {
    var endpoint;

    beforeEach(function () {
      endpoint = Endpoint.create(BASE_URL, {}, {}, api_def.punts, 'punts').punts;
    });

    it('should have a get method', function () {
      endpoint.get.should.exist;
      endpoint.get.should.be.an.instanceof(Function);
    });

    it('should have a post method', function () {
      endpoint.post.should.exist;
      endpoint.post.should.be.an.instanceof(Function);
    });

    it('should have a put method', function () {
      endpoint.put.should.exist;
      endpoint.put.should.be.an.instanceof(Function);
    });

    it('should have a delete method', function () {
      endpoint.delete.should.exist;
      endpoint.delete.should.be.an.instanceof(Function);
    });

    it('should reject the promise if the endpoint does not support the verb', function () {
      function shouldThrow() {
        endpoint = new Endpoint({
          base_url: BASE_URL,
          name: 'sys/no_get',
          verbs: api_def['sys/no_get']
        });
        endpoint.get();
      }
      shouldThrow.should.throw(/Unsupported method get for API/);
    });

    it('should return a promise if the endpoint supports the verb', function () {
      debuglog('server_url: ', endpoint.server_url);
      // promise is returned but it is rejected since the route does not actually
      // exist within the vault server.
      endpoint.get().should.be.rejectedWith(/404 page not found/);
    });

    it('should reject promise if endpoint requires id and one is not provided', function () {
      function shouldThrow() {
        endpoint = Endpoint.create(
          BASE_URL, {}, {}, api_def['sys/no_get/:id'], 'sys/no_get/:id')['sys/no_get/:id'];
        endpoint.put();
      }
      shouldThrow.should.throw(/requires an id/);
    });

    it('should reject promise if endpoint requires param', function () {
      function shouldThrow() {
        endpoint.put({id: 'abc', _required: 'id'});
      }
      shouldThrow.should.throw(/Missing required input/);
    });
  });

});
