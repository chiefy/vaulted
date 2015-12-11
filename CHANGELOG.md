# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0][unreleased]
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

## 1.0.0 - 2015-07-31
#### Added
- This CHANGELOG file to hopefully serve as an evolving example of a standardized open source project CHANGELOG.
- Initial project release. Supporting small subset of Vault's HTTP API

[unreleased]: https://github.com/chiefy/vaulted/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/chiefy/vaulted/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/chiefy/vaulted/compare/v1.0.0...v1.0.0