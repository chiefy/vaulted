# Vaulted
[![Build Status](https://travis-ci.org/chiefy/vaulted.svg)](https://travis-ci.org/chiefy/vaulted) [![Code Climate](https://codeclimate.com/github/chiefy/vaulted/badges/gpa.svg)](https://codeclimate.com/github/chiefy/vaulted) [![Test Coverage](https://codeclimate.com/github/chiefy/vaulted/badges/coverage.svg)](https://codeclimate.com/github/chiefy/vaulted/coverage) [![Join the chat at https://gitter.im/chiefy/vaulted](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/chiefy/vaulted?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Vaulted is a nodejs-based wrapper for the [Vault](https://vaultproject.io) HTTP API.

# Installation
```bash
$ npm install vaulted
```

# Example
```javascript
var Vaulted = require('vaulted');

var my_vault = new Vaulted({
  env: 'dev',
  vault_url: 'https://vault.server',
  secret_shares: 5,
  secret_threshold: 3
});

my_vault.init()
  .bind(my_vault)
  .then(function() {
    console.info('Initialized vault!', this.status);
    return this.unSeal();
  })
  .then(function() {
    console.info('Unsealed vault!');
  })
  .catch(function caughtError(err) {
      console.error('Could not initialize or unseal vault.' + err.message);
      process.exit(1);
  });

```

# Documentation
[Vaulted Methods](./docs/)

Vaulted Method | Vault API (/v1)
-------------- | ---------------
[getInitStatus](./docs/init.md#module_init..getInitStatus) | GET `sys/init`
[init](./docs/init.md#module_init..init) | PUT `sys/init`
[getSealedStatus](./docs/seal.md#module_seal..getSealedStatus) | GET `sys/seal-status`
[seal](./docs/seal.md#module_seal..seal) | PUT `sys/seal`
[unSeal](./docs/seal.md#module_seal..unSeal) | PUT `sys/unseal`
[getMounts](./docs/mounts.md#module_mounts..getMounts) | GET `sys/mounts`
[deleteMount](./docs/mounts.md#module_mounts..deleteMount) | DELETE `sys/mounts/:id`
[createMount](./docs/mounts.md#module_mounts..createMount) | POST `sys/mounts/:id`
[reMount](./docs/mounts.md#module_mounts..reMount) | POST `sys/remount`
[getAuditMounts](./docs/audit.md#module_audit..getAuditMounts) | GET `sys/audit`
[enableAudit](./docs/audit.md#module_audit..enableAudit) | PUT `sys/audit/:id`
[disableAudit](./docs/audit.md#module_audit..disableAudit) | DELETE `sys/audit/:id`
[enableFileAudit](./docs/audit.md#module_audit..enableFileAudit) | PUT `sys/audit/:id`
[enableSyslogAudit](./docs/audit.md#module_audit..enableSyslogAudit) | PUT `sys/audit/:id`
[getPolicies](./docs/policy.md#module_policy..getPolicies) | GET `sys/policy`
[createPolicy](./docs/policy.md#module_policy..createPolicy) | PUT `sys/policy/:id`
[deletePolicy](./docs/policy.md#module_policy..deletePolicy) | DELETE `sys/policy/:id`
[getLeader](./docs/leader.md#leadergetinitstatus--promise) | GET `sys/leader`
[checkHealth](./docs/health.md#healthcheckhealthoptions--promise) | GET `sys/health`
[getKeyStatus](./docs/keys.md#module_keys..getKeyStatus) | GET `sys/key-status`
[rotateKey](./docs/keys.md#module_keys..rotateKey) | PUT `sys/rotate`
[getRekeyStatus](./docs/keys.md#module_keys..getRekeyStatus) | GET `sys/rekey/init`
[startRekey](./docs/keys.md#module_keys..startRekey) | PUT `sys/rekey/init`
[stopRekey](./docs/keys.md#module_keys..stopRekey) | DELETE `sys/rekey/init`
[updateRekey](./docs/keys.md#module_keys..updateRekey) | PUT `sys/rekey/update`
[getAuthMounts](./docs/auth.md#module_auth..getAuthMounts) | GET `sys/auth`
[deleteAuthMount](./docs/auth.md#module_auth..deleteAuthMount) | DELETE `sys/auth/:id`
[createAuthMount](./docs/auth.md#module_auth..createAuthMount) | POST `sys/auth/:id`
[createToken](./docs/auth/token.md#module_auth/token..createToken) | POST `auth/token/create`
[renewToken](./docs/auth/token.md#module_auth/token..renewToken) | POST `auth/token/renew/:id`
[lookupToken](./docs/auth/token.md#module_auth/token..lookupToken) | GET `auth/token/lookup/:id`
[revokeToken](./docs/auth/token.md#module_auth/token..revokeToken) | POST `auth/token/revoke/:id`
[revokeTokenOrphan](./docs/auth/token.md#module_auth/token..revokeTokenOrphan) | POST `auth/token/revoke-orphan/:id`
[revokeTokenPrefix](./docs/auth/token.md#module_auth/token..revokeTokenPrefix) | POST `auth/token/revoke-prefix/:id`
[lookupTokenSelf](./docs/auth/token.md#module_auth/token..lookupTokenSelf) | GET `auth/token/lookup-self`
[revokeTokenSelf](./docs/auth/token.md#module_auth/token..revokeTokenSelf) | POST `auth/token/revoke-self`
[getApp](./docs/auth/appid.md#module_auth/appid..getApp) | GET `auth/app-id/map/app-id/:id`
[createApp](./docs/auth/appid.md#module_auth/appid..createApp) | POST `auth/app-id/map/app-id/:id`
[deleteApp](./docs/auth/appid.md#module_auth/appid..deleteApp) | DELETE `auth/app-id/map/app-id/:id`
[getUser](./docs/auth/appid.md#module_auth/appid..getUser) | GET `auth/app-id/map/user-id/:id`
[createUser](./docs/auth/appid.md#module_auth/appid..createUser) | POST `auth/app-id/map/user-id/:id`
[deleteUser](./docs/auth/appid.md#module_auth/appid..deleteUser) | DELETE `auth/app-id/map/user-id/:id`
[appLogin](./docs/auth/appid.md#module_auth/appid..appLogin) | POST `auth/app-id/login`
[read](./docs/secret.md#module_secret..read) | GET `secret/:id`
[write](./docs/secret.md#module_secret..write) | PUT `secret/:id`
[delete](./docs/secret.md#module_secret..delete) | DELETE `secret/:id`
[configConsulAccess](./docs/backends/consul.md#module_backend/consul..configConsulAccess) | POST `consul/config/access`
[getConsulRole](./docs/backends/consul.md#module_backend/consul..getConsulRole) | GET `consul/roles/:id`
[createConsulRole](./docs/backends/consul.md#module_backend/consul..createConsulRole) | POST `consul/roles/:id`
[deleteConsulRole](./docs/backends/consul.md#module_backend/consul..deleteConsulRole) | DELETE `consul/roles/:id`
[generateConsulRoleToken](./docs/backends/consul.md#module_backend/consul..generateConsulRoleToken) | GET `consul/creds/:id`

# Available Options
Attribute | Environment Variable | Default Value | Description
--------- | -------------------- | ------------- | -----------
vault_host | VAULT_HOST | `127.0.0.1` | Vault server hostname
vault_port | VAULT_PORT | `8200` | Vault server port
vault_ssl | VAULT_SSL | `true` (enabled) | Use SSL?
vault_token | VAULT_TOKEN |  | Token to use to access the vault
ssl_ciphers | VAULT_SSL_CIPHERS | `TLSv1.2` | The ciphers that will be used when communicating with vault over ssl
ssl_cert_file | VAULT_SSL_CERT |  | Path to custom SSL cert file
ssl_pem_file | VAULT_SSL_CERT_KEY |  | Path of SSL cert PEM file to use with custom SSL verification
ssl_pem_passphrase | VAULT_SSL_CERT_PASSPHRASE |  | Passphrase associated SSL cert PEM file to use with custom SSL verification
ssl_ca_cert | VAULT_CACERT |  | CA cert path used for certification verification
ssl_verify | VAULT_SSL_VERIFY | `true` | validate SSL requests?
timeout | VAULT_TIMEOUT |  | milliseconds to wait for response headers
proxy_address | VAULT_PROXY_ADDRESS |  | HTTP Proxy server address
proxy_password | VAULT_PROXY_PASSWORD |  | HTTP Proxy user password
proxy_port | VAULT_PROXY_PORT |  | HTTP Proxy server port
proxy_username | VAULT_PROXY_USERNAME |  | HTTP Proxy server username
debug | DEBUG | `false` | Show verbose messages, network requests?
secret_shares | SECRET_SHARES | `3` | Number of shared secret keys to generate
secret_threshold | SECRET_THRESHOLD | `2` | Threshold at which to unseal vault (must be <= SECRET_SHARES)
backup_dir | VAULT_SAFE | `~/.vault` | Directory to backup keys

# Running The Express-app Example
In order to run the example, you will need to install:
  * GNU Make
  * Docker (boot2docker)
  * Docker-Compose

```bash
$ make run-local
```
After starting the servers, you can point a tool like POSTman at `http://$(boot2docker ip):3000`. You can perform read/write/delete operations on secrets:

```bash
curl \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{ "hashicorp": "amazeballs", "poop": "stinky" }' \
  'http://$(boot2docker ip):3000/secret/poop'
```
```json
{"success":true}
```

```bash
curl \
  -X GET \
  'http://$(boot2docker ip):3000/secret/poop'
```

```json
{
  "lease_id": "secret/poop/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
  "renewable": false,
  "lease_duration": 2592000,
  "data": {
    "hashicorp": "amazeballs",
    "poop": "stinky"
  },
  "auth": null
}
```

# Development
Use the `docker-compose.yml` to aid development. PRs are very, very welcome. Please add tests when including new functionality.

## Running Tests
```bash
$ make test
```

```bash
$ make test-watch
```

# License
[MIT License](LICENSE)
