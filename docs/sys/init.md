<a name="module_init"></a>
## init ⇐ <code>Vaulted</code>
Provides implementation for the Vault Initialization APIs

**Extends:** <code>Vaulted</code>  

* [init](#module_init) ⇐ <code>Vaulted</code>
    * [~init(options)](#module_init..init) ⇒ <code>Promise</code>
    * [~getInitStatus()](#module_init..getInitStatus) ⇒ <code>Promise</code>

<a name="module_init..init"></a>
### init~init(options) ⇒ <code>Promise</code>
Initializes a remote vault

**Kind**: inner method of <code>[init](#module_init)</code>  
**Resolve**: <code>Vaulted</code> Resolves with keys and token or current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| [options.secret_shares] | <code>number</code> | <code>config[&#x27;secret_shares&#x27;]</code> | number of shares to split the master key into |
| [options.secret_threshold] | <code>number</code> | <code>config[&#x27;secret_threshold&#x27;]</code> | number of shares required to reconstruct the master key |

<a name="module_init..getInitStatus"></a>
### init~getInitStatus() ⇒ <code>Promise</code>
Gets the initialize status of a vault

**Kind**: inner method of <code>[init](#module_init)</code>  
**Resolve**: <code>Status</code> Resolves with the vault initializtion status  
**Reject**: <code>Error</code> An error indicating what went wrong  
