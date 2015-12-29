<a name="module_secret"></a>
## secret ⇐ <code>Vaulted</code>
Provides implementation for the Vault Secret APIs

**Extends:** <code>Vaulted</code>  

* [secret](#module_secret) ⇐ <code>Vaulted</code>
    * [~write(options, [mountName])](#module_secret..write) ⇒ <code>Promise</code>
    * [~read(options, [mountName])](#module_secret..read) ⇒ <code>Promise</code>
    * [~delete(options, [mountName])](#module_secret..delete) ⇒ <code>Promise</code>

<a name="module_secret..write"></a>
### secret~write(options, [mountName]) ⇒ <code>Promise</code>
Write a secret to the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the secret |
| options.body | <code>Object</code> |  | containing the structure of the secret to store |
| [mountName] | <code>string</code> | <code>&quot;secret&quot;</code> | path name the generic secret backend is mounted on |

<a name="module_secret..read"></a>
### secret~read(options, [mountName]) ⇒ <code>Promise</code>
Read / get a secret from the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: <code>Secret</code> Resolves with the secret  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the secret |
| [mountName] | <code>string</code> | <code>&quot;secret&quot;</code> | path name the generic secret backend is mounted on |

<a name="module_secret..delete"></a>
### secret~delete(options, [mountName]) ⇒ <code>Promise</code>
Delete a secret from the generic backend

**Kind**: inner method of <code>[secret](#module_secret)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the secret |
| [mountName] | <code>string</code> | <code>&quot;secret&quot;</code> | path name the generic secret backend is mounted on |

