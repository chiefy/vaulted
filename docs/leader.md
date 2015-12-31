<a name="module_leader"></a>
## leader ⇐ <code>Vaulted</code>
Provides implementation for the Vault Leader APIs

**Extends:** <code>Vaulted</code>  
<a name="module_leader..getInitStatus"></a>
### leader~getInitStatus([options]) ⇒ <code>Promise</code>
Gets the leader of a vault

**Kind**: inner method of <code>[leader](#module_leader)</code>  
**Resolve**: <code>Leader</code> Resolves with the vault leader  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | object of options to send to API request |
| [options.token] | <code>string</code> | the authentication token |

