'use strict';
require('./helpers').should;

var
  helpers = require('./helpers'),
  debuglog = helpers.debuglog,
  expect = helpers.expect,
  internal = require('../lib/internal');


describe('internal state', function () {

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
      debuglog('Mounts are synchronized on #prepare so this test is invalid and has been deprecated.');
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

});
