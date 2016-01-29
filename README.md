# Vaulted

[![Build Status](https://travis-ci.org/chiefy/vaulted.svg)](https://travis-ci.org/chiefy/vaulted) [![Code Climate](https://codeclimate.com/github/chiefy/vaulted/badges/gpa.svg)](https://codeclimate.com/github/chiefy/vaulted) [![Test Coverage](https://codeclimate.com/github/chiefy/vaulted/badges/coverage.svg)](https://codeclimate.com/github/chiefy/vaulted/coverage) [![Package Quality](http://npm.packagequality.com/shield/vaulted.svg)](http://packagequality.com/#?package=vaulted) [![Join the chat at https://gitter.im/chiefy/vaulted](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/chiefy/vaulted?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Vaulted is a nodejs-based wrapper for the [Vault](https://vaultproject.io) HTTP API.

## Installation

```bash
$ npm install vaulted
```


## Getting Started


#### New Vault

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: false
});

var keys;

myVault.prepare()
  .bind(myVault)
  .then(function () {
    return myVault.init();
  }).then(function (data) {
    myVault.setToken(data.root_token);
    keys = data.keys;
  })
  .then(function () {
    return myVault.unSeal({
      body: {
        key: keys[0]
      }
    });
  })
  .then(function () {
    return myVault.unSeal({
      body: {
        key: keys[1]
      }
    });
  })
  .then(function () {
    console.log('Vault is now ready!');
  })
  .catch(function onError(err) {
    console.error('Could not initialize or unseal vault:', err.message, err.error);
  });
```


#### Existing Vault - set token globally

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: false
});

myVault.setToken('mytoken');

myVault.prepare()
  .then(function () {
    console.log('Vault is now ready!');
  });
```


#### Existing Vault - set token per-call

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: false
});

myVault.prepare('mytoken')
  .then(function () {
    console.log('Vault is now ready!');
  });
```


## Configuring

The available options below can either be passed to the Vaulted constructor, using environment variables, or configuration files.


### Constructor

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200,
  vault_ssl: false,
  timeout: 5000
});
```


### Environment Variables

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


### Configuration File

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


### Available Options

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


## Example - An Express Application

In order to run the example, you will need to install:
  * GNU Make
  * [Docker](https://www.docker.com/) using either of these
    * [Docker Toolbox](https://www.docker.com/products/docker-toolbox)
    * [boot2docker](http://boot2docker.io/)
  * [Docker-Compose](https://docs.docker.com/compose/)

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


## Development

Use the `docker-compose-test.yml` to aid development. PRs are very, very welcome. Please add tests when including new functionality.


### Running Tests

```bash
$ docker-compose -f docker-compose-test.yml up -d consul vault
$ docker-compose -f docker-compose-test.yml run vaulted
```


## License

The MIT License (MIT)

Copyright (c) 2015-2016 Christopher "Chief" Najewicz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
