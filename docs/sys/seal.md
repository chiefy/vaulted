<a name="module_seal"></a>
## seal ⇐ <code>Vaulted</code>
Provides implementation for the Vault Seal APIs

**Extends:** <code>Vaulted</code>  

* [seal](#module_seal) ⇐ <code>Vaulted</code>
    * [~getSealedStatus()](#module_seal..getSealedStatus) ⇒ <code>Promise</code>
    * [~seal([options])](#module_seal..seal) ⇒ <code>Promise</code>
    * [~unSeal(options)](#module_seal..unSeal) ⇒ <code>Promise</code>

<a name="module_seal..getSealedStatus"></a>
### seal~getSealedStatus() ⇒ <code>Promise</code>
Gets the sealed status of a vault and sets internal property accordingly

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted after setting seal status  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_seal..seal"></a>
### seal~seal([options]) ⇒ <code>Promise</code>
Seals the vault

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | object of options to send to API request |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_seal..unSeal"></a>
### seal~unSeal(options) ⇒ <code>Promise</code>
Unseals the vault

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| options.body.key | <code>Object</code> | A single master share key |
| [options.body.reset] | <code>Object</code> | if true, the previously-provided unseal keys are discarded from memory and the unseal process is reset. |

