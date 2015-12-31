<a name="module_auth/appid"></a>
## auth/appid ⇐ <code>Vaulted</code>
Provides implementation for the Vault Auth Appid backend APIs

**Extends:** <code>Vaulted</code>  

* [auth/appid](#module_auth/appid) ⇐ <code>Vaulted</code>
    * [~getApp(options, [mountName])](#module_auth/appid..getApp) ⇒ <code>Promise</code>
    * [~createApp(options, [mountName])](#module_auth/appid..createApp) ⇒ <code>Promise</code>
    * [~deleteApp(options, [mountName])](#module_auth/appid..deleteApp) ⇒ <code>Promise</code>
    * [~getUser(options, [mountName])](#module_auth/appid..getUser) ⇒ <code>Promise</code>
    * [~createUser(options, [mountName])](#module_auth/appid..createUser) ⇒ <code>Promise</code>
    * [~deleteUser(options, [mountName])](#module_auth/appid..deleteUser) ⇒ <code>Promise</code>
    * [~appLogin([mountName])](#module_auth/appid..appLogin) ⇒ <code>Promise</code>

<a name="module_auth/appid..getApp"></a>
### auth/appid~getApp(options, [mountName]) ⇒ <code>Promise</code>
Retrieve the specified app using the app id.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: <code>App</code> Resolves with the app details  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the app |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..createApp"></a>
### auth/appid~createApp(options, [mountName]) ⇒ <code>Promise</code>
Creates the specified app in the app-id auth backend of the vault.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the app |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.value | <code>string</code> |  | the policy id |
| options.body.display_name | <code>string</code> |  | human-readable name of the app. |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..deleteApp"></a>
### auth/appid~deleteApp(options, [mountName]) ⇒ <code>Promise</code>
Deletes the specified app from the app-id auth backend of the vault.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the app |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..getUser"></a>
### auth/appid~getUser(options, [mountName]) ⇒ <code>Promise</code>
Retrieve the specified user using the user id.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: <code>User</code> Resolves with the user details  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the user |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..createUser"></a>
### auth/appid~createUser(options, [mountName]) ⇒ <code>Promise</code>
Creates the specified user in the app-id auth backend of the vault.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the user |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.value | <code>string</code> |  | the app id |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..deleteUser"></a>
### auth/appid~deleteUser(options, [mountName]) ⇒ <code>Promise</code>
Deletes the specified user from the app-id auth backend of the vault.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the user |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

<a name="module_auth/appid..appLogin"></a>
### auth/appid~appLogin([mountName]) ⇒ <code>Promise</code>
Authenticates the user of the app using the app-id authentication backend.

**Kind**: inner method of <code>[auth/appid](#module_auth/appid)</code>  
**Resolve**: <code>Auth</code> Resolves with authentication details including client token.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.app_id | <code>string</code> |  | the app id |
| options.body.user_id | <code>string</code> |  | the user id |
| [options.token] | <code>string</code> |  | the authentication token |
| [mountName] | <code>string</code> | <code>&quot;app-id&quot;</code> | path name the app-id auth backend is mounted on |

