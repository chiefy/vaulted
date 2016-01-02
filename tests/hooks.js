'use strict';
require('./helpers').should;

var
  helpers = require('./helpers'),
  chai = helpers.chai,
  debuglog = helpers.debuglog,
  Hooks = require('../lib/hooks');

chai.use(helpers.cap);


describe('hooks', function () {
  var hooks;

  before(function () {
    hooks = new Hooks();
  });

  describe('#pre', function () {

    it('successfully register pre hook', function () {
        function preTrial() {
          debuglog('function preTrial');
        }
        hooks.pre('trial', preTrial);
        hooks._pres.should.have.property('trial');
    });

  });

  describe('#execPre', function () {

    it('successfully run execPre with no hooks', function () {
      function shouldNotThrow() {
        var otherHooks = new Hooks();
        otherHooks.execPre('other', {});
      }
      shouldNotThrow.should.not.throw('any error');
    });

    it('successfully execute pre hook - without args', function () {
        var value = null;
        function testHook() {
            value = 'success';
        }
        hooks.pre('testing', testHook);
        hooks.execPre('testing', {});
        value.should.be.equal('success');
    });

    it('successfully execute pre hook - with args', function () {
        var value = null;
        function testHook(data) {
            value = data;
        }
        hooks.pre('testargs', testHook);
        hooks.execPre('testargs', {}, ['arg-success']);
        value.should.be.equal('arg-success');
    });

  });

  describe('#post', function () {

    it('successfully register post hook', function () {
        function postTrial() {
          debuglog('function postTrial');
        }
        hooks.post('trial', postTrial);
        hooks._posts.should.have.property('trial');
    });

  });

  describe('#execPost', function () {

    it('successfully run execPost with no hooks', function () {
      function shouldNotThrow() {
        var otherHooks = new Hooks();
        otherHooks.execPost('other', {});
      }
      shouldNotThrow.should.not.throw('any error');
    });

    it('successfully execute post hook - without args', function () {
        var value = null;
        function testHook() {
            value = 'success';
        }
        hooks.post('testing', testHook);
        hooks.execPost('testing', {});
        value.should.be.equal('success');
    });

    it('successfully execute post hook - with args', function () {
        var value = null;
        function testHook(data) {
            value = data;
        }
        hooks.post('testargs', testHook);
        hooks.execPost('testargs', {}, ['arg-success']);
        value.should.be.equal('arg-success');
    });

  });

});