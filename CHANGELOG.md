# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]
#### Added
#### Changed

## [2.1.1] - 2015-12-31
#### Changed
- Set a path to the default configuration files to leverage default values.

## [2.1.0] - 2015-12-30
#### Added
- Support for Consul storage backend
- Support for Consul secrets backend
  + `consul/config/access`: Provides the capability to configure a Consul cluster as a secrets backend.
  + `consul/roles/*`: Provides the capability to create, delete, and retrieve roles (aka policies) associated with secrets.
  + `consul/creds/*`: Provides the capability to get a token for writing/reading secrets stored within Consul.
- Support for PKI secret backend for Vault that generates X.509 certificates dynamically based on configured roles.
  + `pki/*`: Provides several ways to manage certificates and generation for use by clients to authenticate.
- Support for Lease Renewal/Revocation
  + `sys/renew/*`: Provides requesting to extend the lease of secret.
  + `sys/revoke/*`: Provides revoking a secret immediately.
  + `sys/revoke-prefix/*`: Provides revoking all secrets generated under a given prefix immediately.
- Support for get Policy
  + `sys/policy/*`: Provides retrieving a specified policy.
- Support for Cubbyhole secret backend
  + `cubbyhole/*`: Provides the capability to create, delete, and retrieves secret.
- Support for dynamically mounted endpoints
- Dynamic API validation based on parameter definitions
- SSL configuration options
  + `ssl_ciphers`, `ssl_cert_file`, `ssl_pem_file`, `ssl_pem_passphrase`, `ssl_ca_cert`, `ssl_verify`
- Proxy configuration options
  + `proxy_address`, `proxy_port`, `proxy_username`, `proxy_password`
- timeout configuration option
  + `timeout`
- Automated builds using Travis-ci.
- Automated static code analysis and coverage using Code Climate
- Generated documentation

#### Changed
- Removed internal configuration options `prefix`, `api_def_files`
- Use `vault_token` configuration option as provided by user.
- Treat configuration options that are not required as optional.


## [2.0.0] - 2015-12-15
#### Added
- Add Authentication and Authorization support
  + `sys/auth`: Provides the capability to create, delete, and retrieve
auth mounts from the Vault.
  + `sys/policy`: Provides the capability to create, delete, and retrieve
policies from the Vault.
  + `auth/token`: Adds token auth backend support that provides the
capability to create, revoke, and lookup authentication tokens.
  + `auth/app-id`: Adds app-id auth backend support that provides the
capability to configure and authenticate using the app-id
authentication backend
- Add Key Rotation support
  + `sys/key-status`
  + `sys/rekey/*`
  + `sys/rotate`
- Add Audit Trail support
  + `sys/audit`
  + `file` backend
  + `syslog` backend
- Add Health and Leader support
  + `sys/leader`: Provides the capability to determine if the Vault
is HA enabled, if the vault being communicated with is the leader,
and what the address is for the leader.
  + `sys/health`: Provides the capability to retrieve the health status
of the vault.

#### Changed
- Improve argument against commit logs.
- Code and test clean up.
- Code coverage enabled (~99%)
- Documentation for all public methods added.

## [1.1.0] - 2015-08-03
#### Added
- Added support for `sys/mounts` and `sys/remount`

#### Changed
- Refactored a lot of code making it a bit more modular.
- Config now supports debug, vault-server host, vault-server port etc.

## [1.0.0] - 2015-07-31
#### Added
- This CHANGELOG file to hopefully serve as an evolving example of a standardized open source project CHANGELOG.
- Initial project release. Supporting small subset of Vault's HTTP API

[unreleased]: https://github.com/chiefy/vaulted/compare/v2.1.1...master
[2.1.1]: https://github.com/chiefy/vaulted/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/chiefy/vaulted/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/chiefy/vaulted/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/chiefy/vaulted/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/chiefy/vaulted/compare/55a14aff522d5d5b45a1ea35ef3e6b6fa37e5e49...v1.0.0
