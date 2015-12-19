<a name="module_keys"></a>
## keys ⇐ <code>Vaulted</code>
Provides implementation for the Vault Key Rotation APIs

**Extends:** <code>Vaulted</code>  

* [keys](#module_keys) ⇐ <code>Vaulted</code>
    * [~getKeyStatus()](#module_keys..getKeyStatus) ⇒ <code>Promise</code>
    * [~rotateKey()](#module_keys..rotateKey) ⇒ <code>Promise</code>
    * [~getRekeyStatus()](#module_keys..getRekeyStatus) ⇒ <code>Promise</code>
    * [~startRekey(options)](#module_keys..startRekey) ⇒ <code>Promise</code>
    * [~stopRekey()](#module_keys..stopRekey) ⇒ <code>Promise</code>
    * [~updateRekey()](#module_keys..updateRekey) ⇒ <code>Promise</code>

<a name="module_keys..getKeyStatus"></a>
### keys~getKeyStatus() ⇒ <code>Promise</code>
Gets the status of the current key

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: <code>Status</code> Resolves with the vault key status.  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_keys..rotateKey"></a>
### keys~rotateKey() ⇒ <code>Promise</code>
Initiate the rotation of the encryption key for data stored in the vault

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_keys..getRekeyStatus"></a>
### keys~getRekeyStatus() ⇒ <code>Promise</code>
Gets the status of the rekey process.

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: <code>Status</code> Resolves with the vault rekey status.  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_keys..startRekey"></a>
### keys~startRekey(options) ⇒ <code>Promise</code>
Start the rekey process.

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| [options.secret_shares] | <code>number</code> | <code>config[&#x27;secret_shares&#x27;]</code> | number of shares to split the master key into |
| [options.secret_threshold] | <code>number</code> | <code>config[&#x27;secret_threshold&#x27;]</code> | number of shares required to reconstruct the master key |

<a name="module_keys..stopRekey"></a>
### keys~stopRekey() ⇒ <code>Promise</code>
Stops/Cancels the current rekey process.

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_keys..updateRekey"></a>
### keys~updateRekey() ⇒ <code>Promise</code>
Sends the next key share to continue the rekey process.

**Kind**: inner method of <code>[keys](#module_keys)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted after capturing the keys and token  
**Reject**: <code>Error</code> An error indicating what went wrong  
