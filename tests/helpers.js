'use strict';
var debuglog = require('util').debuglog('vaulted-tests');
var _ = require('lodash');
var Promise = require('bluebird');
var rp = require('request-promise');

var helpers = module.exports = {
  chai: require('chai'),
  assert: require('chai').assert,
  expect: require('chai').expect,
  should: require('chai').should(),
  cap: require('chai-as-promised'),
  debuglog: debuglog,
  VAULT_HOST: process.env.VAULT_HOST || 'vault',
  VAULT_PORT: process.env.VAULT_PORT || 8200,
  CONSUL_HOST: process.env.CONSUL_HOST || '127.0.0.1',
  CONSUL_PORT: process.env.CONSUL_PORT || 8500
};

var Vault = require('../lib/vaulted');

helpers.getVault = function getVault() {
  return new Vault({
    vault_host: helpers.VAULT_HOST,
    vault_port: helpers.VAULT_PORT,
    vault_ssl: false
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

helpers.isTrue = function isTrue(value) {
  return _.isString(value) && (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes');
};

helpers.isVaultReady = function isVaultReady(vault) {
  return Promise.delay(500).then(function () {
    return vault.checkHealth().then(function (status) {
      debuglog('Vault Ready: ', status);
    }).catch(function (err) {
      if (err.statusCode === 429) {
        debuglog('Vault was not ready after first check so try again!');
        return Promise.delay(500).then(function () {
          vault.checkHealth();
        });
      }
    });
  });
};

helpers.createConsulToken = function createConsulToken() {
  var TEST_CONSUL_HOST = process.env.TEST_CONSUL_HOST || '127.0.0.1'
  var TEST_CONSUL_PORT = process.env.TEST_CONSUL_PORT || 8500;
  var options = {
    method: 'PUT',
    uri: 'http://' + TEST_CONSUL_HOST + ':' + TEST_CONSUL_PORT + '/v1/acl/create',
    json: true,
    headers: {
      'X-Consul-Token': 'secret'
    },
    body: {
      Name: 'mgmtkey',
      Type: 'management'
    }
  };
  return rp(options).then(function (data) {
    return data.ID;
  }).catch(function (err) {
    debuglog('createConsulToken failed: ', err);
    return null;
  });
}

helpers.getToken = function getToken(vault) {

  var configConsulAccess = function (token) {
    return vault.configConsulAccess({
      body: {
        address: helpers.CONSUL_HOST + ':' + helpers.CONSUL_PORT,
        token: token
      }
    });
  }

  var createConsulRole = function () {
    return vault.createConsulRole({
      id: 'writer',
      body: {
        policy: 'path "secret/*" { policy = "write" }',
        lease: '1h'
      }
    });
  }

  var generateConsulRoleToken = function () {
    return vault.generateConsulRoleToken({
      id: 'writer'
    });
  }

  return helpers.createConsulToken()
    .then(configConsulAccess)
    .then(createConsulRole)
    .then(generateConsulRoleToken)
    .then(function (role) {
      debuglog('generated token: ', role);
      return role;
    }).catch(function (err) {
      debuglog('getToken error: ', err);
      return null;
  });

}
