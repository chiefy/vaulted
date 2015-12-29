<a name="module_backend/consul"></a>
## backend/consul ⇐ <code>Vaulted</code>
Provides implementation for the Vault Consul Secret backend APIs

**Extends:** <code>Vaulted</code>  

* [backend/consul](#module_backend/consul) ⇐ <code>Vaulted</code>
    * [~configConsulAccess([mountName])](#module_backend/consul..configConsulAccess) ⇒ <code>Promise</code>
    * [~createConsulRole(options, [mountName])](#module_backend/consul..createConsulRole) ⇒ <code>Promise</code>
    * [~getConsulRole(options, [mountName])](#module_backend/consul..getConsulRole) ⇒ <code>Promise</code>
    * [~deleteConsulRole(options, [mountName])](#module_backend/consul..deleteConsulRole) ⇒ <code>Promise</code>
    * [~generateConsulRoleToken(options, [mountName])](#module_backend/consul..generateConsulRoleToken) ⇒ <code>Promise</code>

<a name="module_backend/consul..configConsulAccess"></a>
### backend/consul~configConsulAccess([mountName]) ⇒ <code>Promise</code>
Configures the access information for Consul secret backend

**Kind**: inner method of <code>[backend/consul](#module_backend/consul)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.address | <code>string</code> |  | address of the Consul instance, provided as host:port |
| options.body.token | <code>string</code> |  | Consul ACL token to use; must be a management type token |
| [options.body.scheme] | <code>string</code> | <code>&quot;HTTP&quot;</code> | URL scheme to use |
| [mountName] | <code>string</code> | <code>&quot;consul&quot;</code> | path name the consul secret backend is mounted on |

<a name="module_backend/consul..createConsulRole"></a>
### backend/consul~createConsulRole(options, [mountName]) ⇒ <code>Promise</code>
Creates or updates the Consul role definition

**Kind**: inner method of <code>[backend/consul](#module_backend/consul)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the consul role |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.policy | <code>string</code> |  | base64 encoded Consul ACL policy |
| [options.body.token_type] | <code>string</code> | <code>&quot;client&quot;</code> | type of token to create using this role ('client', 'management') |
| [options.body.lease] | <code>string</code> |  | lease value provided as a string duration with time suffix |
| [mountName] | <code>string</code> | <code>&quot;consul&quot;</code> | path name the consul secret backend is mounted on |

<a name="module_backend/consul..getConsulRole"></a>
### backend/consul~getConsulRole(options, [mountName]) ⇒ <code>Promise</code>
Retrieve a specified Consul role definition

**Kind**: inner method of <code>[backend/consul](#module_backend/consul)</code>  
**Resolve**: <code>Role</code> Consul role structure  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the consul role |
| [mountName] | <code>string</code> | <code>&quot;consul&quot;</code> | path name the consul secret backend is mounted on |

<a name="module_backend/consul..deleteConsulRole"></a>
### backend/consul~deleteConsulRole(options, [mountName]) ⇒ <code>Promise</code>
Removes a specified Consul role definition

**Kind**: inner method of <code>[backend/consul](#module_backend/consul)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the consul role |
| [mountName] | <code>string</code> | <code>&quot;consul&quot;</code> | path name the consul secret backend is mounted on |

<a name="module_backend/consul..generateConsulRoleToken"></a>
### backend/consul~generateConsulRoleToken(options, [mountName]) ⇒ <code>Promise</code>
Generate a dynamic Consul token based on the role definition

**Kind**: inner method of <code>[backend/consul](#module_backend/consul)</code>  
**Resolve**: <code>Auth</code> Resolves with token details.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the consul role |
| [mountName] | <code>string</code> | <code>&quot;consul&quot;</code> | path name the consul secret backend is mounted on |

