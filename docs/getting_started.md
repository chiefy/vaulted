# Getting Started

## New Vault

When starting a new Vault instance the basic flow goes init --> unseal --> any other action.

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


## Existing Vault

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
