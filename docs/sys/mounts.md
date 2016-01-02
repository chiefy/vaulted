<a name="module_mounts"></a>
## mounts ⇐ <code>Vaulted</code>
Provides implementation for the Vault Secret Backend Mounts APIs

**Extends:** <code>Vaulted</code>  

* [mounts](#module_mounts) ⇐ <code>Vaulted</code>
    * [~getMounts([options])](#module_mounts..getMounts) ⇒ <code>Promise</code>
    * [~deleteMount(options)](#module_mounts..deleteMount) ⇒ <code>Promise</code>
    * [~createMount(options)](#module_mounts..createMount) ⇒ <code>Promise</code>
    * [~reMount(options)](#module_mounts..reMount) ⇒ <code>Promise</code>
    * [~mountConsul([options])](#module_mounts..mountConsul) ⇒ <code>Promise</code>
    * [~mountPki([options])](#module_mounts..mountPki) ⇒ <code>Promise</code>

<a name="module_mounts..getMounts"></a>
### mounts~getMounts([options]) ⇒ <code>Promise</code>
Gets the list of mounts for the vault and sets internal property accordingly

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | object of options to send to API request |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_mounts..deleteMount"></a>
### mounts~deleteMount(options) ⇒ <code>Promise</code>
Deletes the specified mount from the vault and sets internal property accordingly

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret backend mount |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_mounts..createMount"></a>
### mounts~createMount(options) ⇒ <code>Promise</code>
Creates the specified mount in the vault and sets internal property accordingly

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the secret backend mount |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| options.body.type | <code>string</code> | the type of secret backend ('consul', 'pki') |
| [options.body.description] | <code>string</code> | a description of the secret backend for operators. |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_mounts..reMount"></a>
### mounts~reMount(options) ⇒ <code>Promise</code>
Renames the specified mount to a new name in the vault and sets internal property accordingly

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.from | <code>string</code> | current unique identifier for the secret backend mount |
| options.to | <code>string</code> | new unique identifier for the secret backend mount |
| [options.token] | <code>string</code> | the authentication token |

<a name="module_mounts..mountConsul"></a>
### mounts~mountConsul([options]) ⇒ <code>Promise</code>
Convenience method to enable the `consul` secret backend for use with the vault.

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | object of options to send to API request |
| [options.id] | <code>string</code> | <code>&quot;consul&quot;</code> | unique identifier for the secret backend mount |
| [options.body] | <code>Object</code> |  | holds the attributes passed as inputs |
| [options.body.description] | <code>string</code> |  | a description of the secret backend for operators. |
| [options.token] | <code>string</code> |  | the authentication token |

<a name="module_mounts..mountPki"></a>
### mounts~mountPki([options]) ⇒ <code>Promise</code>
Convenience method to enable the `pki` secret backend for use with the vault.

**Kind**: inner method of <code>[mounts](#module_mounts)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted secret backends  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | object of options to send to API request |
| [options.id] | <code>string</code> | <code>&quot;pki&quot;</code> | unique identifier for the secret backend mount |
| [options.body] | <code>Object</code> |  | holds the attributes passed as inputs |
| [options.body.description] | <code>string</code> |  | a description of the secret backend for operators. |
| [options.token] | <code>string</code> |  | the authentication token |

