var debuglog = require('util').debuglog('vaulted-tests');
var _ = require('lodash');

var helpers = module.exports = {
  chai: require('chai'),
  assert: require('chai').assert,
  expect: require('chai').expect,
  should: require('chai').should(),
  cap: require('chai-as-promised'),
  debuglog: debuglog,
  VAULT_HOST: process.env.VAULT_HOST || 'vault',
  VAULT_PORT: process.env.VAULT_PORT || 8200
};

var Vault = require('../lib/vaulted');

helpers.getVault = function getVault() {
  return new Vault({
    vault_host: this.VAULT_HOST,
    vault_port: this.VAULT_PORT,
    vault_ssl: 0
  });
};

helpers.getEmptyVault = function getEmptyVault() {
  return new Vault({});
};

helpers.getPreparedVault = function getPreparedVault() {
  return this.getVault().prepare();
};

helpers.getReadyVault = function getReadyVault() {
  var myVault = this.getVault();

  return myVault.prepare().bind(myVault)
    .then(myVault.init)
    .then(myVault.unSeal)
    .catch(function onError(err) {
      debuglog('(before) vault setup failed: %s', err.message);
    });
};

helpers.resealVault = function resealVault(vault) {
  return vault.seal().then(function () {
    debuglog('vault sealed: %s', vault.status.sealed);
  }).catch(function (err) {
    debuglog(err);
    debuglog('failed to seal vault: %s', err.message);
  });
};

helpers.isTrue = function isTrue(value) {
  return _.isString(value) && (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes');
};
