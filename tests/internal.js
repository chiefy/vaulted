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
      expect(aVault.api.endpoints['myCon/config/access']).to.be.undefined;
      expect(aVault.api.endpoints['auth/myApp/login']).to.be.undefined;
      internal.syncMounts(aVault);
      debuglog('syncMounts completed');
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

});
