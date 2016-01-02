<a name="module_endpoint"></a>
## endpoint
Implements the request wrapper around actual API endpoints.


* [endpoint](#module_endpoint)
    * [module.exports(config)](#exp_module_endpoint--module.exports) ⇒ <code>Endpoint</code> ⏏
        * [~Endpoint](#module_endpoint--module.exports..Endpoint)
            * [new Endpoint(options)](#new_module_endpoint--module.exports..Endpoint_new)
            * _instance_
                * [.defaults](#module_endpoint--module.exports..Endpoint+defaults) : <code>Object</code>
                * [.name](#module_endpoint--module.exports..Endpoint+name) : <code>string</code>
                * [.server_url](#module_endpoint--module.exports..Endpoint+server_url) : <code>string</code>
                * [.verbs](#module_endpoint--module.exports..Endpoint+verbs) : <code>Object</code>
            * _static_
                * [.create(url, defaults, apis, verbs, name)](#module_endpoint--module.exports..Endpoint.create) ⇒ <code>Endpoint</code>
        * [~get(method, options)](#module_endpoint--module.exports..get) ⇒ <code>Promise</code>
        * [~put(method, options)](#module_endpoint--module.exports..put) ⇒ <code>Promise</code>
        * [~post(method, options)](#module_endpoint--module.exports..post) ⇒ <code>Promise</code>
        * [~delete(method, options)](#module_endpoint--module.exports..delete) ⇒ <code>Promise</code>

<a name="exp_module_endpoint--module.exports"></a>
### module.exports(config) ⇒ <code>Endpoint</code> ⏏
Setup function for Endpoint module; provides debug support and returns
the Endpoint class.

**Kind**: Exported function  
**Returns**: <code>Endpoint</code> - Endpoint class reference  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | overrides any default configurations. |

<a name="module_endpoint--module.exports..Endpoint"></a>
#### module.exports~Endpoint
**Kind**: inner class of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

* [~Endpoint](#module_endpoint--module.exports..Endpoint)
    * [new Endpoint(options)](#new_module_endpoint--module.exports..Endpoint_new)
    * _instance_
        * [.defaults](#module_endpoint--module.exports..Endpoint+defaults) : <code>Object</code>
        * [.name](#module_endpoint--module.exports..Endpoint+name) : <code>string</code>
        * [.server_url](#module_endpoint--module.exports..Endpoint+server_url) : <code>string</code>
        * [.verbs](#module_endpoint--module.exports..Endpoint+verbs) : <code>Object</code>
    * _static_
        * [.create(url, defaults, apis, verbs, name)](#module_endpoint--module.exports..Endpoint.create) ⇒ <code>Endpoint</code>

<a name="new_module_endpoint--module.exports..Endpoint_new"></a>
##### new Endpoint(options)
Endpoint constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to configure the Endpoint |
| options.name | <code>string</code> |  | the name / API path |
| options.base_url | <code>string</code> |  | the base Vault server url |
| options.verbs | <code>Object</code> |  | the methods defined for the Endpoint |
| [options.defaults] | <code>Object</code> | <code>{}</code> | the default request options |

<a name="module_endpoint--module.exports..Endpoint+defaults"></a>
##### endpoint.defaults : <code>Object</code>
**Kind**: instance property of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
<a name="module_endpoint--module.exports..Endpoint+name"></a>
##### endpoint.name : <code>string</code>
**Kind**: instance property of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
<a name="module_endpoint--module.exports..Endpoint+server_url"></a>
##### endpoint.server_url : <code>string</code>
**Kind**: instance property of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
<a name="module_endpoint--module.exports..Endpoint+verbs"></a>
##### endpoint.verbs : <code>Object</code>
**Kind**: instance property of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
<a name="module_endpoint--module.exports..Endpoint.create"></a>
##### Endpoint.create(url, defaults, apis, verbs, name) ⇒ <code>Endpoint</code>
Helper function to create a new instance of Endpoint

**Kind**: static method of <code>[Endpoint](#module_endpoint--module.exports..Endpoint)</code>  
**Returns**: <code>Endpoint</code> - new instance of Endpoint  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | the base Vault server url |
| defaults | <code>Object</code> | the default request options |
| apis | <code>Object</code> | an object containing named APIs |
| verbs | <code>Object</code> | the methods defined for the Endpoint. |
| name | <code>string</code> | the name / API path |

<a name="module_endpoint--module.exports..get"></a>
#### module.exports~get(method, options) ⇒ <code>Promise</code>
Performs a get request operation for the named endpoint.

**Kind**: inner method of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | the verb name. |
| options | <code>Object</code> | the request inputs. |

<a name="module_endpoint--module.exports..put"></a>
#### module.exports~put(method, options) ⇒ <code>Promise</code>
Performs a put request operation for the named endpoint.

**Kind**: inner method of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | the verb name. |
| options | <code>Object</code> | the request inputs. |

<a name="module_endpoint--module.exports..post"></a>
#### module.exports~post(method, options) ⇒ <code>Promise</code>
Performs a post request operation for the named endpoint.

**Kind**: inner method of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | the verb name. |
| options | <code>Object</code> | the request inputs. |

<a name="module_endpoint--module.exports..delete"></a>
#### module.exports~delete(method, options) ⇒ <code>Promise</code>
Performs a delete request operation for the named endpoint.

**Kind**: inner method of <code>[module.exports](#exp_module_endpoint--module.exports)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | the verb name. |
| options | <code>Object</code> | the request inputs. |

