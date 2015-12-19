<a name="module_audit"></a>
## audit ⇐ <code>Vaulted</code>
Provides implementation for the Vault Audit APIs

**Extends:** <code>Vaulted</code>  

* [audit](#module_audit) ⇐ <code>Vaulted</code>
    * [~getAuditMounts()](#module_audit..getAuditMounts) ⇒ <code>Promise</code>
    * [~enableAudit(options)](#module_audit..enableAudit) ⇒ <code>Promise</code>
    * [~disableAudit(options)](#module_audit..disableAudit) ⇒ <code>Promise</code>
    * [~enableFileAudit(options)](#module_audit..enableFileAudit) ⇒ <code>Promise</code>
    * [~enableSyslogAudit(options)](#module_audit..enableSyslogAudit) ⇒ <code>Promise</code>

<a name="module_audit..getAuditMounts"></a>
### audit~getAuditMounts() ⇒ <code>Promise</code>
Gets the list of mounted audit backends for the vault.

**Kind**: inner method of <code>[audit](#module_audit)</code>  
**Resolve**: <code>[Mounts]</code> Resolves with current list of mounted audit backends  
**Reject**: <code>Error</code> An error indicating what went wrong  
<a name="module_audit..enableAudit"></a>
### audit~enableAudit(options) ⇒ <code>Promise</code>
Enable a specific audit backend for use with the vault.

**Kind**: inner method of <code>[audit](#module_audit)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the audit mount |
| options.body | <code>Object</code> | holds the attributes passed as inputs |
| options.body.type | <code>string</code> | the type of audit ('file', 'syslog') |
| [options.body.description] | <code>string</code> | a description of the audit backend for operators. |
| [options.body.options] | <code>Object</code> | options for configuring a specific type of audit backend |

<a name="module_audit..disableAudit"></a>
### audit~disableAudit(options) ⇒ <code>Promise</code>
Disable a specific audit backend from the vault.

**Kind**: inner method of <code>[audit](#module_audit)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | object of options to send to API request |
| options.id | <code>string</code> | unique identifier for the audit mount |

<a name="module_audit..enableFileAudit"></a>
### audit~enableFileAudit(options) ⇒ <code>Promise</code>
Convenience method to enable the `file` audit backend for use with the vault.

**Kind**: inner method of <code>[audit](#module_audit)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the file audit mount |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.path | <code>string</code> |  | the directory where to write the audit files |
| [options.body.description] | <code>string</code> |  | a description of the file audit backend for operators. |
| [options.body.log_raw] | <code>boolean</code> | <code>false</code> | should security sensitive information be logged raw. |

<a name="module_audit..enableSyslogAudit"></a>
### audit~enableSyslogAudit(options) ⇒ <code>Promise</code>
Convenience method to enable the `syslog` audit backend for use with the vault.

**Kind**: inner method of <code>[audit](#module_audit)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | unique identifier for the syslog audit mount |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| [options.body.description] | <code>string</code> |  | a description of the syslog audit backend for operators. |
| [options.body.facility] | <code>string</code> | <code>&quot;AUTH&quot;</code> | syslog facility to use. |
| [options.body.tag] | <code>string</code> | <code>&quot;vault&quot;</code> | syslog tag to use. |
| [options.body.log_raw] | <code>boolean</code> | <code>false</code> | should security sensitive information be logged raw. |

