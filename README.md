# Vaulted
[![Build Status](https://travis-ci.org/chiefy/vaulted.svg)](https://travis-ci.org/chiefy/vaulted) [![Code Climate](https://codeclimate.com/github/chiefy/vaulted/badges/gpa.svg)](https://codeclimate.com/github/chiefy/vaulted) [![Test Coverage](https://codeclimate.com/github/chiefy/vaulted/badges/coverage.svg)](https://codeclimate.com/github/chiefy/vaulted/coverage) [![Join the chat at https://gitter.im/chiefy/vaulted](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/chiefy/vaulted?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Vaulted is a nodejs-based wrapper for the [Vault](https://vaultproject.io) HTTP API.

# Installation
```bash
$ npm install vaulted
```

# Documentation

* [Getting Starting Guide](./docs/getting_started.md)
* [Vaulted API Index](./docs/index.md)
* [Available Configurations](./docs/all_options.md)

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
Use the `docker-compose-test.yml` to aid development. PRs are very, very welcome. Please add tests when including new functionality.

## Running Tests
```bash
$ docker-compose -f docker-compose-test.yml up -d consul vault
$ docker-compose -f docker-compose-test.yml run vaulted
```

# License
[MIT License](LICENSE)
