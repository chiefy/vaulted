# Configuring
The available options below can either be passed to the Vaulted constructor, using environment variables, or configuration files.

## Constructor
```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: false,
  timeout: 5000
});
```

## Environment Variables
```bash
$ export VAULT_HOST=127.0.0.1
$ export VAULT_PORT=8200
$ export VAULT_SSL=false
$ export VAULT_TIMEOUT=5000
```

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted();
```

## Configuration File
File: `config/default.yml`

```yaml
vault_host: 127.0.0.1
vault_port: 8200
vault_ssl: true
```

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted();
```

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
no_global_token | VAULT_NO_GLOBAL_TOKEN | `false` | Require token per API call
