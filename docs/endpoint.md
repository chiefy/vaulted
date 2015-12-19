<a name="module_endpoint"></a>
## endpoint
Implements the request wrapper around actual API endpoints.


* [endpoint](#module_endpoint)
    * [module.exports(config)](#exp_module_endpoint--module.exports) ⇒ <code>Endpoint</code> ⏏
        * [~Endpoint](#module_endpoint--module.exports..Endpoint)
            * [new Endpoint(options)](#new_module_endpoint--module.exports..Endpoint_new)
            * _instance_
                * [.getURI(options)](#module_endpoint--module.exports..Endpoint+getURI) ⇒ <code>Endpoint</code>
            * _static_
                * [.create(url, verbs)](#module_endpoint--module.exports..Endpoint.create) ⇒ <code>Endpoint</code>

<a name="exp_module_endpoint--module.exports"></a>
### module.exports(config) ⇒ <code>Endpoint</code> ⏏
Setup function for Endpoint module; provides debug support and returns
the Endpoint class.

**Kind**: Exported function  
**Returns**: <code>Endpoint</code> - Endpoint class reference  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | overrides any configuration set by node-convict setup. |

<a name="module_endpoint--module.exports..Endpoint"></a>
#### module.exports~Endpoint
**Kind**: inner class of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

* [~Endpoint](#module_endpoint--module.exports..Endpoint)
    * [new Endpoint(options)](#new_module_endpoint--module.exports..Endpoint_new)
    * _instance_
        * [.getURI(options)](#module_endpoint--module.exports..Endpoint+getURI) ⇒ <code>Endpoint</code>
    * _static_
        * [.create(url, verbs)](#module_endpoint--module.exports..Endpoint.create) ⇒ <code>Endpoint</code>

<a name="new_module_endpoint--module.exports..Endpoint_new"></a>
##### new Endpoint(options)
Endpoint constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Hash of options create the Endpoint, keys "name", "verbs", "base_url" required. |

<a name="module_endpoint--module.exports..Endpoint+getURI"></a>
##### endpoint.getURI(options) ⇒ <code>Endpoint</code>
Generates a formatted url for the Endpoint

**Kind**: instance method of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
**Returns**: <code>Endpoint</code> - new instance of Endpoint  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Hash of options, keys "id" supported. |

<a name="module_endpoint--module.exports..Endpoint.create"></a>
##### Endpoint.create(url, verbs) ⇒ <code>Endpoint</code>
Helper function to create a new instance of Endpoint

**Kind**: static method of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
**Returns**: <code>Endpoint</code> - new instance of Endpoint  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | base url for the endpoint |
| verbs | <code>Object</code> | Hash of methods available for an Endpoint. |

