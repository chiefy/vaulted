require('./helpers.js').should;

var
  _ = require('lodash'),
  fs = require('fs'),
  Vault = require('../lib/vaulted.js'),
  Endpoint = require('../lib/endpoint.js');

describe('Endpoint', function() {

  var api_def = JSON.parse(fs.readFileSync('tests/configs/api_test.json')).v1;

  before(function() {});

  describe('#init', function() {
    var endpoint;

    beforeEach(function() {
      var options = _.defaults(api_def[0],{ base_url: 'http://localhost:8200'});
      endpoint = new Endpoint(options);
    });

    it('should have a name', function() {
      endpoint.should.have.property('name');
      endpoint.name.should.equal('punts');
    });

    it('should have an array of verbs', function() {
      endpoint.should.have.property('verbs');
      endpoint.verbs.should.be.an.instanceof(Array);
    });

    it('should throw an exception when there are no verbs', function() {
      (function() {
        endpoint = new Endpoint(api_def[1]);
      }).should.throw(Error);
    });

    it('should throw an exception when there is no base_url', function () {
      (function() {
        endpoint = new Endpoint(api_def[1]);
      }).should.throw(Error);
    });

  });

  describe('#getURI', function() {
    var endpoint, options;

    beforeEach(function() {
      options = _.extend(api_def[0], { base_url: 'https://localhost:8200' });
      endpoint = new Endpoint(options);
    });

    it('should exist', function () {
      endpoint.getURI.should.exist;
      endpoint.getURI.should.be.an.instanceof(Function);;
    });

    it('should append the endpoint to the base uri', function () {
      var endpoint_uri = endpoint.getURI();
      endpoint_uri.should.equal('https://localhost:8200/punts');
    });

  });

  describe('#get', function() {
    var endpoint;

    it('should have a get method', function() {
      endpoint = new Endpoint(api_def[0]);
      endpoint.get.should.exist;
      endpoint.get.should.be.an.instanceof(Function);
    });

    it('should return false if the endpoint does not support it', function() {
      endpoint = new Endpoint(api_def[0]);
      endpoint.get().should.be.false;
    });

    it('should return a promise otherwise', function() {

    });

  });

});

