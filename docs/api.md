<a name="module_api"></a>
## api
Provides public facade layer around API endpoints.


* [api](#module_api)
    * [~API](#module_api..API)
        * [new API(config)](#new_module_api..API_new)
    * [~API_DEFINITIONS](#module_api..API_DEFINITIONS) : <code>string</code>
    * [~API_PREFIX](#module_api..API_PREFIX) : <code>string</code>
    * [~getEndpoint(endpoint)](#module_api..getEndpoint) ⇒ <code>EndPoint</code>

<a name="module_api..API"></a>
### api~API
**Kind**: inner class of <code>[api](#module_api)</code>  
<a name="new_module_api..API_new"></a>
#### new API(config)
API constructor


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | overrides any configuration set by node-convict setup. |

<a name="module_api..API_DEFINITIONS"></a>
### api~API_DEFINITIONS : <code>string</code>
**Kind**: inner constant of <code>[api](#module_api)</code>  
<a name="module_api..API_PREFIX"></a>
### api~API_PREFIX : <code>string</code>
**Kind**: inner constant of <code>[api](#module_api)</code>  
**Default**: <code>&quot;v1&quot;</code>  
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

