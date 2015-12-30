# Getting Started

## New Vault

When starting a new Vault instance the basic flow goes init --> unseal --> any other action.

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200
});

myVault.init()
  .bind(myVault)
  .then(myVault.init)
  .then(myVault.unSeal)
  .then(function () {
    console.log('Vault is now ready!');
  })
  .catch(function onError(err) {
    console.error('Could not initialize or unseal vault: %s', err.message);
  });
```

By default the token and keys are in a backup file located in the directory specified by the value of `backup_dir`.

## Existing Vault

When working with an existing Vault the basic flow depends on if the backup file exists or not.

```javascript
var Vaulted = require('vaulted');

var myVault = new Vaulted({
  vault_host: '127.0.0.1',
  vault_port: 8200
});

// without backup file this step is required otherwise
// the step below is all that is required.
myVault.setToken('mytoken');

myVault.prepare()
  .then(function () {
    console.log('Vault is now ready!');
  });
```
