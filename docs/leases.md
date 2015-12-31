<a name="module_leases"></a>
## leases ⇐ <code>Vaulted</code>
Provides implementation for the Vault Renew/Revoke Leases APIs

**Extends:** <code>Vaulted</code>  

* [leases](#module_leases) ⇐ <code>Vaulted</code>
    * [~renewLease(options)](#module_leases..renewLease) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~revokeLease(options)](#module_leases..revokeLease) ⇒ <code>Promise</code>
    * [~revokeLeasePrefix(options)](#module_leases..revokeLeasePrefix) ⇒ <code>Promise</code>

<a name="module_leases..renewLease"></a>
### leases~renewLease(options) ⇒ <code>Promise.&lt;Object&gt;</code>
Renew the lease (extend) on a secret

**Kind**: inner method of <code>[leases](#module_leases)</code>  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Promise which is resolved to the renewed secret.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the lease |
| [options.body] | <code>Object</code> | holds the attributes passed as inputs |
| [options.body.increment] | <code>string</code> | requested amount of time in seconds to extend the lease. |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_leases..revokeLease"></a>
### leases~revokeLease(options) ⇒ <code>Promise</code>
Revoke the lease on a secret immediately.

**Kind**: inner method of <code>[leases](#module_leases)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the lease |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_leases..revokeLeasePrefix"></a>
### leases~revokeLeasePrefix(options) ⇒ <code>Promise</code>
Revoke the lease on all secrets under the specified prefix immediately.

**Kind**: inner method of <code>[leases](#module_leases)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the lease |
| [options.token] | <code>string</code> | the authentication token |

