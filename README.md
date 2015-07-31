# Vaulted
Vaulted is a nodejs-based wrapper for the [Vault](https://vaultproject.io) HTTP API.

# Installation
Use `npm` to install:
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
Is severly lacking right now. Hopefully will be remedied soon.

# Running The Express-app Example
In order to run the example, you will need to install:
  * GNU Make
  * Docker (boot2docker)
  * Docker-Compose

```bash
$ make run-local
```
After starting the servers, you can point a tool like POSTman at `http://$(boot2docker ip):3000`. You can perform read/write/delete operations on secrets:

```
curl \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{ "hashicorp": "amazeballs", "poop": "stinky" }' \
  'http://$(boot2docker ip):3000/secret/poop'
```
```
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

# Vault API Support
Currently the supported API calls are:
  * sys/init
  * sys/seal
  * sys/unseal
  * sys/seal-status
  * secret/*

I am hoping to add more as soon as possible.

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