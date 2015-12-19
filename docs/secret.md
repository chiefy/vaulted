<a name="module_secret"></a>
## secret ⇐ <code>Vaulted</code>
Provides implementation for the Vault Secret APIs

**Extends:** <code>Vaulted</code>  

* [secret](#module_secret) ⇐ <code>Vaulted</code>
    * [~write(options)](#module_secret..write) ⇒ <code>Promise</code>
    * [~read(options)](#module_secret..read) ⇒ <code>Promise</code>
    * [~delete(options)](#module_secret..delete) ⇒ <code>Promise</code>

<a name="module_secret..write"></a>
### secret~write(options) ⇒ <code>Promise</code>
Write a secret to the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |
| options.body | <code>Object</code> | containing the structure of the secret to store |

<a name="module_secret..read"></a>
### secret~read(options) ⇒ <code>Promise</code>
Read / get a secret from the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: <code>Secret</code> Resolves with the secret  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |

<a name="module_secret..delete"></a>
### secret~delete(options) ⇒ <code>Promise</code>
Delete a secret from the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |

