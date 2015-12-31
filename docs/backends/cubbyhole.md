<a name="module_cubbyhole"></a>
## cubbyhole ⇐ <code>Vaulted</code>
Provides implementation for the Vault Cubbyhole APIs

**Extends:** <code>Vaulted</code>  

* [cubbyhole](#module_cubbyhole) ⇐ <code>Vaulted</code>
    * [~writeCubby(options)](#module_cubbyhole..writeCubby) ⇒ <code>Promise</code>
    * [~readCubby(options)](#module_cubbyhole..readCubby) ⇒ <code>Promise</code>
    * [~deleteCubby(options)](#module_cubbyhole..deleteCubby) ⇒ <code>Promise</code>

<a name="module_cubbyhole..writeCubby"></a>
### cubbyhole~writeCubby(options) ⇒ <code>Promise</code>
Stores a secret at the specified location

**Kind**: inner method of <code>[cubbyhole](#module_cubbyhole)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |
| options.body | <code>Object</code> | containing the structure of the secret to store |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_cubbyhole..readCubby"></a>
### cubbyhole~readCubby(options) ⇒ <code>Promise</code>
Retrieves the secret at the specified location

**Kind**: inner method of <code>[cubbyhole](#module_cubbyhole)</code>  
**Resolve**: <code>Secret</code> Resolves with the secret  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_cubbyhole..deleteCubby"></a>
### cubbyhole~deleteCubby(options) ⇒ <code>Promise</code>
Delete secret at the specified location

**Kind**: inner method of <code>[cubbyhole](#module_cubbyhole)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret |
| [options.token] | <code>string</code> | the authentication token |

