<a name="module_policy"></a>
## policy ⇐ <code>Vaulted</code>
Provides implementation for the Vault Policy APIs

**Extends:** <code>Vaulted</code>  

* [policy](#module_policy) ⇐ <code>Vaulted</code>
    * [~getPolicies()](#module_policy..getPolicies) ⇒ <code>Promise</code>
    * [~createPolicy(options)](#module_policy..createPolicy) ⇒ <code>Promise</code>
    * [~deletePolicy(options)](#module_policy..deletePolicy) ⇒ <code>Promise</code>

<a name="module_policy..getPolicies"></a>
### policy~getPolicies() ⇒ <code>Promise</code>
Gets the list of policies for the vault and sets internal property accordingly

**Kind**: inner method of <code>[policy](#module_policy)</code>  
**Resolve**: <code>[Policy]</code> Resolves with list of policy.  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_policy..createPolicy"></a>
### policy~createPolicy(options) ⇒ <code>Promise</code>
Creates the specified policy in the vault and sets internal property accordingly

**Kind**: inner method of <code>[policy](#module_policy)</code>  
**Resolve**: <code>[Policy]</code> Resolves with list of policy.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the policy |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| options.body.rules | <code>string</code> | the definition of the policy rules (HCL or json format) |

<a name="module_policy..deletePolicy"></a>
### policy~deletePolicy(options) ⇒ <code>Promise</code>
Deletes the specified policy from the vault and sets internal property accordingly

**Kind**: inner method of <code>[policy](#module_policy)</code>  
**Resolve**: <code>[Policy]</code> Resolves with list of policy.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the policy |

