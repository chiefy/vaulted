<a name="module_api"></a>
## api
Provides public facade layer around API endpoints.


* [api](#module_api)
    * [~API](#module_api..API)
        * [new API(config)](#new_module_api..API_new)
        * [.endpoints](#module_api..API+endpoints) : <code>Object</code>
        * [.specs](#module_api..API+specs) : <code>Object</code>
    * [~API_DEFINITIONS](#module_api..API_DEFINITIONS) : <code>string</code>
    * [~API_SPECS](#module_api..API_SPECS) : <code>string</code>
    * [~API_PREFIX](#module_api..API_PREFIX) : <code>string</code>
    * [~mountEndpoints(config, type, namespace)](#module_api..mountEndpoints)
    * [~unmountEndpoints(namespace)](#module_api..unmountEndpoints)
    * [~getEndpoint(endpoint)](#module_api..getEndpoint) ⇒ <code>EndPoint</code>

<a name="module_api..API"></a>
### api~API
**Kind**: inner class of <code>[api](#module_api)</code>  

* [~API](#module_api..API)
    * [new API(config)](#new_module_api..API_new)
    * [.endpoints](#module_api..API+endpoints) : <code>Object</code>
    * [.specs](#module_api..API+specs) : <code>Object</code>

<a name="new_module_api..API_new"></a>
#### new API(config)
API constructor


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | overrides any default configurations. |

<a name="module_api..API+endpoints"></a>
#### apI.endpoints : <code>Object</code>
**Kind**: instance property of <code>[API](#module_api..API)</code>  
<a name="module_api..API+specs"></a>
#### apI.specs : <code>Object</code>
**Kind**: instance property of <code>[API](#module_api..API)</code>  
<a name="module_api..API_DEFINITIONS"></a>
### api~API_DEFINITIONS : <code>string</code>
**Kind**: inner constant of <code>[api](#module_api)</code>  
<a name="module_api..API_SPECS"></a>
### api~API_SPECS : <code>string</code>
**Kind**: inner constant of <code>[api](#module_api)</code>  
<a name="module_api..API_PREFIX"></a>
### api~API_PREFIX : <code>string</code>
**Kind**: inner constant of <code>[api](#module_api)</code>  
**Default**: <code>&quot;v1&quot;</code>  
<a name="module_api..mountEndpoints"></a>
### api~mountEndpoints(config, type, namespace)
Mounts a set of Endpoints from a given spec type to a specified namespace.

**Kind**: inner method of <code>[api](#module_api)</code>  
**Throws**:

- <code>Error</code> - namespace not provided or has no length.
- <code>Error</code> - type not provided or has no length.
- <code>Error</code> - Could not find type in defintions.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | overrides any default configurations. |
| type | <code>String</code> | the name of the spec that references a set of Endpoints. |
| namespace | <code>String</code> | the name to mount a specified set of Endpoints to. |

<a name="module_api..unmountEndpoints"></a>
### api~unmountEndpoints(namespace)
Unmounts a set of Endpoints from a specified namespace.

**Kind**: inner method of <code>[api](#module_api)</code>  
**Throws**:

- <code>Error</code> - namespace not provided or has no length.
- <code>Error</code> - Could not find namespace in APIs.


| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>String</code> | the name associated with Endpoints to unmount . |

<a name="module_api..getEndpoint"></a>
### api~getEndpoint(endpoint) ⇒ <code>EndPoint</code>
Retrieves the named endpoint.

**Kind**: inner method of <code>[api](#module_api)</code>  
**Returns**: <code>EndPoint</code> - An instance matching the specificed name.  
**Throws**:

- <code>Error</code> - Endpoint not provided or has no length.
- <code>Error</code> - Could not find endpoint: {endpoint_name} in API defintions


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>String</code> | the name / path of the defined endpoint. |

