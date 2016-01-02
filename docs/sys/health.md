<a name="module_health"></a>
## health ⇐ <code>Vaulted</code>
Provides implementation for the Vault Health APIs

**Extends:** <code>Vaulted</code>  
<a name="module_health..checkHealth"></a>
### health~checkHealth(options) ⇒ <code>Promise</code>
Gets the health of the vault

**Kind**: inner method of <code>[health](#module_health)</code>  
**Resolve**: <code>Status</code> Resolves with the current status/health of Vault  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.standbyok | <code>boolean</code> | true to indicate a standby is acceptable |

