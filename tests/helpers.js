module.exports = {
  chai: require('chai'),
  assert: require('chai').assert,
  expect: require('chai').expect,
  should: require('chai').should(),
  cap: require('chai-as-promised'),
  VAULT_HOST: process.env.VAULT_HOST || 'vault',
  VAULT_PORT: process.env.VAULT_PORT || 8200
};
