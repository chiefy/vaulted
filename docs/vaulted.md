<a name="module_vaulted"></a>
## vaulted
Vaulted is a nodejs-based wrapper for the Vault HTTP API.

**Author:** Christopher 'Chief' Najewicz <chief@beefdisciple.com>  

* [vaulted](#module_vaulted)
    * [~Vaulted](#module_vaulted..Vaulted)
        * [new Vaulted(options)](#new_module_vaulted..Vaulted_new)
        * [.config](#module_vaulted..Vaulted+config) : <code>Object</code>
        * [.api](#module_vaulted..Vaulted+api) : <code>API</code>
        * [.status](#module_vaulted..Vaulted+status) : <code>Object</code>
        * [.token](#module_vaulted..Vaulted+token) : <code>string</code>
        * [.auths](#module_vaulted..Vaulted+auths) : <code>Object</code>
        * [.mounts](#module_vaulted..Vaulted+mounts) : <code>Object</code>
        * [.headers](#module_vaulted..Vaulted+headers) : <code>Object</code>
        * [.initialized](#module_vaulted..Vaulted+initialized) : <code>boolean</code>
    * [~prepare()](#module_vaulted..prepare) ⇒ <code>Promise</code>
    * [~setToken(vault_token)](#module_vaulted..setToken) ⇒ <code>Vaulted</code>
    * [~setStatus(status)](#module_vaulted..setStatus) ⇒ <code>Vaulted</code>
    * [~validateEndpoint(endpoint, [mountName], [defaultName])](#module_vaulted..validateEndpoint) ⇒ <code>EndPoint</code>

<a name="module_vaulted..Vaulted"></a>
### vaulted~Vaulted
**Kind**: inner class of <code>[vaulted](#module_vaulted)</code>  

* [~Vaulted](#module_vaulted..Vaulted)
    * [new Vaulted(options)](#new_module_vaulted..Vaulted_new)
    * [.config](#module_vaulted..Vaulted+config) : <code>Object</code>
    * [.api](#module_vaulted..Vaulted+api) : <code>API</code>
    * [.status](#module_vaulted..Vaulted+status) : <code>Object</code>
    * [.token](#module_vaulted..Vaulted+token) : <code>string</code>
    * [.auths](#module_vaulted..Vaulted+auths) : <code>Object</code>
    * [.mounts](#module_vaulted..Vaulted+mounts) : <code>Object</code>
    * [.headers](#module_vaulted..Vaulted+headers) : <code>Object</code>
    * [.initialized](#module_vaulted..Vaulted+initialized) : <code>boolean</code>

<a name="new_module_vaulted..Vaulted_new"></a>
#### new Vaulted(options)
Vaulted constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | overrides any default configurations. |

<a name="module_vaulted..Vaulted+config"></a>
#### vaulted.config : <code>Object</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+api"></a>
#### vaulted.api : <code>API</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+status"></a>
#### vaulted.status : <code>Object</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+token"></a>
#### vaulted.token : <code>string</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+auths"></a>
#### vaulted.auths : <code>Object</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+mounts"></a>
#### vaulted.mounts : <code>Object</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+headers"></a>
#### vaulted.headers : <code>Object</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..Vaulted+initialized"></a>
#### vaulted.initialized : <code>boolean</code>
**Kind**: instance property of <code>[Vaulted](#module_vaulted..Vaulted)</code>  
<a name="module_vaulted..prepare"></a>
### vaulted~prepare() ⇒ <code>Promise</code>
Attempt to load the Vault state.

**Kind**: inner method of <code>[vaulted](#module_vaulted)</code>  
**Resolve**: <code>Vaulted</code> Resolves with current instance of Vaulted  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_vaulted..setToken"></a>
### vaulted~setToken(vault_token) ⇒ <code>Vaulted</code>
Sets the token to use when accessing the vault,
also sets the 'X-Vault-Token' header with token value

**Kind**: inner method of <code>[vaulted](#module_vaulted)</code>  
**Returns**: <code>Vaulted</code> - instance of Vaulted  
**Throws**:

- <code>Error</code> - Vault token not provided, or has zero-length.


| Param | Type | Description |
| --- | --- | --- |
| vault_token | <code>String</code> | the root/master token |

<a name="module_vaulted..setStatus"></a>
### vaulted~setStatus(status) ⇒ <code>Vaulted</code>
Set status hash

**Kind**: inner method of <code>[vaulted](#module_vaulted)</code>  
**Returns**: <code>Vaulted</code> - instance of Vaulted  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>Object</code> | representing vaulted status, which includes 'sealed' property. |

<a name="module_vaulted..validateEndpoint"></a>
### vaulted~validateEndpoint(endpoint, [mountName], [defaultName]) ⇒ <code>EndPoint</code>
Validate the request endpoint and that the Vault is prepared for use.

**Kind**: inner method of <code>[vaulted](#module_vaulted)</code>  
**Returns**: <code>EndPoint</code> - An instance matching the specificed name.  
**Throws**:

- <code>Error</code> - Vault has not been initialized.
- <code>Error</code> - Vault has not been unsealed.


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | the name / path of the defined endpoint. |
| [mountName] | <code>string</code> | path name an endpoint is mounted on |
| [defaultName] | <code>string</code> | default path name an endpoint is mounted on |

