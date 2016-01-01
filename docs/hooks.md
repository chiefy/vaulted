<a name="module_hooks"></a>
## hooks
Provides a generic pre/post hook implementation.


* [hooks](#module_hooks)
    * [~Hooks](#module_hooks..Hooks)
        * [new Hooks()](#new_module_hooks..Hooks_new)
        * [.execPre(name, context, args)](#module_hooks..Hooks+execPre)
        * [.execPost(name, context, args)](#module_hooks..Hooks+execPost)
        * [.pre(name, fn)](#module_hooks..Hooks+pre) ⇒ <code>Hooks</code>
        * [.post(name, fn)](#module_hooks..Hooks+post) ⇒ <code>Hooks</code>

<a name="module_hooks..Hooks"></a>
### hooks~Hooks
**Kind**: inner class of <code>[hooks](#module_hooks)</code>  

* [~Hooks](#module_hooks..Hooks)
    * [new Hooks()](#new_module_hooks..Hooks_new)
    * [.execPre(name, context, args)](#module_hooks..Hooks+execPre)
    * [.execPost(name, context, args)](#module_hooks..Hooks+execPost)
    * [.pre(name, fn)](#module_hooks..Hooks+pre) ⇒ <code>Hooks</code>
    * [.post(name, fn)](#module_hooks..Hooks+post) ⇒ <code>Hooks</code>

<a name="new_module_hooks..Hooks_new"></a>
#### new Hooks()
Hooks constructor

<a name="module_hooks..Hooks+execPre"></a>
#### hooks.execPre(name, context, args)
Execute all the registered pre hooks

**Kind**: instance method of <code>[Hooks](#module_hooks..Hooks)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the function that is being hooked. |
| context | <code>Object</code> | a context object like `this`. |
| args | <code>Array</code> | a list of arguments to pass to the hook. |

<a name="module_hooks..Hooks+execPost"></a>
#### hooks.execPost(name, context, args)
Execute all the registered post hooks

**Kind**: instance method of <code>[Hooks](#module_hooks..Hooks)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the function that is being hooked. |
| context | <code>Object</code> | a context object like `this`. |
| args | <code>Array</code> | a list of arguments to pass to the hook. |

<a name="module_hooks..Hooks+pre"></a>
#### hooks.pre(name, fn) ⇒ <code>Hooks</code>
Register a function to execute before the named function.

**Kind**: instance method of <code>[Hooks](#module_hooks..Hooks)</code>  
**Returns**: <code>Hooks</code> - instance of Hooks  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the function that is being hooked. |
| fn | <code>function</code> | a function to execute before the named function. |

<a name="module_hooks..Hooks+post"></a>
#### hooks.post(name, fn) ⇒ <code>Hooks</code>
Register a function to execute after the named function.

**Kind**: instance method of <code>[Hooks](#module_hooks..Hooks)</code>  
**Returns**: <code>Hooks</code> - instance of Hooks  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the function that is being hooked. |
| fn | <code>function</code> | a function to execute after the named function. |

