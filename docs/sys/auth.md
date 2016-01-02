<a name="module_auth"></a>
## auth ⇐ <code>Vaulted</code>
Provides implementation for the Vault Auth APIs

**Extends:** <code>Vaulted</code>  

* [auth](#module_auth) ⇐ <code>Vaulted</code>
    * [~getAuthMounts([options])](#module_auth..getAuthMounts) ⇒ <code>Promise</code>
    * [~deleteAuthMount(options)](#module_auth..deleteAuthMount) ⇒ <code>Promise</code>
    * [~createAuthMount(options)](#module_auth..createAuthMount) ⇒ <code>Promise</code>

<a name="module_auth..getAuthMounts"></a>
### auth~getAuthMounts([options]) ⇒ <code>Promise</code>
Gets the list of authentication backend mounts for the vault and sets internal property accordingly

**Kind**: inner method of <code>[auth](#module_auth)</code>  
**Resolve**: <code>[Auths]</code> Resolves with current list of mounted auth backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | object of options to send to API request |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_auth..deleteAuthMount"></a>
### auth~deleteAuthMount(options) ⇒ <code>Promise</code>
Deletes the specified authentication backend mount from the vault and sets internal property accordingly

**Kind**: inner method of <code>[auth](#module_auth)</code>  
**Resolve**: <code>[Auths]</code> Resolves with current list of mounted auth backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the auth mount |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_auth..createAuthMount"></a>
### auth~createAuthMount(options) ⇒ <code>Promise</code>
Creates the specified authentication backend mount in the vault and sets internal property accordingly

**Kind**: inner method of <code>[auth](#module_auth)</code>  
**Resolve**: <code>[Auths]</code> Resolves with current list of mounted auth backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the auth mount |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| options.body.type | <code>string</code> | the type of auth ('app-id') |
| [options.body.description] | <code>string</code> | a description of the auth backend for operators. |
| [options.token] | <code>string</code> | the authentication token |

