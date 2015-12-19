<a name="module_seal"></a>
## seal ⇐ <code>Vaulted</code>
Provides implementation for the Vault Seal APIs

**Extends:** <code>Vaulted</code>  

* [seal](#module_seal) ⇐ <code>Vaulted</code>
    * [~getSealedStatus()](#module_seal..getSealedStatus) ⇒ <code>Promise</code>
    * [~seal()](#module_seal..seal) ⇒ <code>Promise</code>
    * [~unSeal()](#module_seal..unSeal) ⇒ <code>Promise</code>

<a name="module_seal..getSealedStatus"></a>
### seal~getSealedStatus() ⇒ <code>Promise</code>
Gets the sealed status of a vault and sets internal property accordingly

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted after setting seal status  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_seal..seal"></a>
### seal~seal() ⇒ <code>Promise</code>
Seals the vault

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_seal..unSeal"></a>
### seal~unSeal() ⇒ <code>Promise</code>
Unseals the vault

**Kind**: inner method of <code>[seal](#module_seal)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  
