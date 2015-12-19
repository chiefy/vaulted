<a name="module_auth/token"></a>
## auth/token ⇐ <code>Vaulted</code>
Provides implementation for the Vault Auth Token backend APIs

**Extends:** <code>Vaulted</code>  

* [auth/token](#module_auth/token) ⇐ <code>Vaulted</code>
    * [~createToken()](#module_auth/token..createToken) ⇒ <code>Promise</code>
    * [~renewToken(options)](#module_auth/token..renewToken) ⇒ <code>Promise</code>
    * [~lookupToken(options)](#module_auth/token..lookupToken) ⇒ <code>Promise</code>
    * [~revokeToken(options)](#module_auth/token..revokeToken) ⇒ <code>Promise</code>
    * [~revokeTokenOrphan(options)](#module_auth/token..revokeTokenOrphan) ⇒ <code>Promise</code>
    * [~revokeTokenPrefix(options)](#module_auth/token..revokeTokenPrefix) ⇒ <code>Promise</code>
    * [~lookupTokenSelf()](#module_auth/token..lookupTokenSelf) ⇒ <code>Promise</code>
    * [~revokeTokenSelf()](#module_auth/token..revokeTokenSelf) ⇒ <code>Promise</code>

<a name="module_auth/token..createToken"></a>
### auth/token~createToken() ⇒ <code>Promise</code>
Creates a token to use for authenticating with the Vault.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: <code>Auth</code> Resolves with token details.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| [options.body.id] | <code>string</code> | ID of the client token |
| [options.body.policies] | <code>Array</code> | list of policies for the token |
| [options.body.meta] | <code>Object</code> | map of string to string valued metadata |
| [options.body.no_parent] | <code>boolean</code> | creates a token with no parent |
| [options.body.no_default_profile] | <code>boolean</code> | default profile will not be a part of this token's policy set |
| [options.body.ttl] | <code>string</code> | TTL period of the token |
| [options.body.display_name] | <code>string</code> | display name of the token |
| [options.body.num_uses] | <code>number</code> | maximum uses for the given token |

<a name="module_auth/token..renewToken"></a>
### auth/token~renewToken(options) ⇒ <code>Promise</code>
Renew an existing token to use for authenticating with the Vault.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: <code>Auth</code> Resolves with token details.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the token |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| [options.body.increment] | <code>number</code> | lease increment |

<a name="module_auth/token..lookupToken"></a>
### auth/token~lookupToken(options) ⇒ <code>Promise</code>
Retrieve information about the specified existing token.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: <code>Auth</code> Resolves with token details.  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the token |

<a name="module_auth/token..revokeToken"></a>
### auth/token~revokeToken(options) ⇒ <code>Promise</code>
Revokes the specified existing token and all child tokens.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the token |

<a name="module_auth/token..revokeTokenOrphan"></a>
### auth/token~revokeTokenOrphan(options) ⇒ <code>Promise</code>
Revokes the specified existing token but not the child tokens.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the token |

<a name="module_auth/token..revokeTokenPrefix"></a>
### auth/token~revokeTokenPrefix(options) ⇒ <code>Promise</code>
Revokes all tokens generated at a given prefix including children and secrets.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | token prefix |

<a name="module_auth/token..lookupTokenSelf"></a>
### auth/token~lookupTokenSelf() ⇒ <code>Promise</code>
Retrieve information about the current client token.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: <code>Auth</code> Resolves with token details.  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_auth/token..revokeTokenSelf"></a>
### auth/token~revokeTokenSelf() ⇒ <code>Promise</code>
Revokes the current client token and all child tokens.

**Kind**: inner method of <code>[auth/token](#module_auth/token)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  
