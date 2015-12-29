<a name="module_backend/pki"></a>
## backend/pki ⇐ <code>Vaulted</code>
Provides implementation for the Vault PKI Secret backend APIs

**Extends:** <code>Vaulted</code>  

* [backend/pki](#module_backend/pki) ⇐ <code>Vaulted</code>
    * [~getCaDer([mountName])](#module_backend/pki..getCaDer) ⇒ <code>Promise</code>
    * [~getCaPem([mountName])](#module_backend/pki..getCaPem) ⇒ <code>Promise</code>
    * [~getCertCa([mountName])](#module_backend/pki..getCertCa) ⇒ <code>Promise</code>
    * [~getCertCrl([mountName])](#module_backend/pki..getCertCrl) ⇒ <code>Promise</code>
    * [~getCertSerial(options, [mountName])](#module_backend/pki..getCertSerial) ⇒ <code>Promise</code>
    * [~setConfigCa([mountName])](#module_backend/pki..setConfigCa) ⇒ <code>Promise</code>
    * [~getConfigCrl([mountName])](#module_backend/pki..getConfigCrl) ⇒ <code>Promise</code>
    * [~setConfigCrl([mountName])](#module_backend/pki..setConfigCrl) ⇒ <code>Promise</code>
    * [~getConfigUrls([mountName])](#module_backend/pki..getConfigUrls) ⇒ <code>Promise</code>
    * [~setConfigUrls([mountName])](#module_backend/pki..setConfigUrls) ⇒ <code>Promise</code>
    * [~getCrlDer([mountName])](#module_backend/pki..getCrlDer) ⇒ <code>Promise</code>
    * [~getCrlPem([mountName])](#module_backend/pki..getCrlPem) ⇒ <code>Promise</code>
    * [~getCrlRotate([mountName])](#module_backend/pki..getCrlRotate) ⇒ <code>Promise</code>
    * [~genIntermediatesExported([mountName])](#module_backend/pki..genIntermediatesExported) ⇒ <code>Promise</code>
    * [~genIntermediatesInternal([mountName])](#module_backend/pki..genIntermediatesInternal) ⇒ <code>Promise</code>
    * [~setSignedIntermediates([mountName])](#module_backend/pki..setSignedIntermediates) ⇒ <code>Promise</code>
    * [~issueCertCredentials([mountName])](#module_backend/pki..issueCertCredentials) ⇒ <code>Promise</code>
    * [~revokeCertCredentials([mountName])](#module_backend/pki..revokeCertCredentials) ⇒ <code>Promise</code>
    * [~createCertRole(options, [mountName])](#module_backend/pki..createCertRole) ⇒ <code>Promise</code>
    * [~getCertRole(options, [mountName])](#module_backend/pki..getCertRole) ⇒ <code>Promise</code>
    * [~deleteCertRole(options, [mountName])](#module_backend/pki..deleteCertRole) ⇒ <code>Promise</code>
    * [~genRootExported([mountName])](#module_backend/pki..genRootExported) ⇒ <code>Promise</code>
    * [~genRootInternal([mountName])](#module_backend/pki..genRootInternal) ⇒ <code>Promise</code>
    * [~signIntermediateWithRoot([mountName])](#module_backend/pki..signIntermediateWithRoot) ⇒ <code>Promise</code>
    * [~signCertificate(options, [mountName])](#module_backend/pki..signCertificate) ⇒ <code>Promise</code>
    * [~signCertificateVerbatim([mountName])](#module_backend/pki..signCertificateVerbatim) ⇒ <code>Promise</code>

<a name="module_backend/pki..getCaDer"></a>
### backend/pki~getCaDer([mountName]) ⇒ <code>Promise</code>
Retrieves the CA certificate in raw DER-encoded form

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>string</code> certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCaPem"></a>
### backend/pki~getCaPem([mountName]) ⇒ <code>Promise</code>
Retrieves the CA certificate in PEM format

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>string</code> certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCertCa"></a>
### backend/pki~getCertCa([mountName]) ⇒ <code>Promise</code>
Retrieves CA certificate in PEM formatting in the certificate key of the JSON object

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCertCrl"></a>
### backend/pki~getCertCrl([mountName]) ⇒ <code>Promise</code>
Retrieves the current CRL certificate in PEM formatting in the certificate key of the JSON object

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCertSerial"></a>
### backend/pki~getCertSerial(options, [mountName]) ⇒ <code>Promise</code>
Retrieves certificate by serial number in PEM formatting in the certificate key of the JSON object

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | certificate serial number |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..setConfigCa"></a>
### backend/pki~setConfigCa([mountName]) ⇒ <code>Promise</code>
Allows submitting the CA information for the backend via a PEM file containing the
CA certificate and its private key, concatenated

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.pem_bundle | <code>string</code> |  | The key and certificate concatenated in PEM format |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getConfigCrl"></a>
### backend/pki~getConfigCrl([mountName]) ⇒ <code>Promise</code>
Allows getting the duration for which the generated CRL should be marked valid

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> CRL duration  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..setConfigCrl"></a>
### backend/pki~setConfigCrl([mountName]) ⇒ <code>Promise</code>
Allows setting the duration for which the generated CRL should be marked valid

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.expiry | <code>string</code> |  | The time until expiration |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getConfigUrls"></a>
### backend/pki~getConfigUrls([mountName]) ⇒ <code>Promise</code>
Fetch the URLs to be encoded in generated certificates

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> URLs  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..setConfigUrls"></a>
### backend/pki~setConfigUrls([mountName]) ⇒ <code>Promise</code>
Allows setting the issuing certificate endpoints

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| [options.body.issuing_certificates] | <code>string</code> |  | URL values for the Issuing Certificate field |
| [options.body.crl_distribution_points] | <code>string</code> |  | URL values for the CRL Distribution Points field |
| [options.body.ocsp_servers] | <code>string</code> |  | URL values for the OCSP Servers field |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCrlDer"></a>
### backend/pki~getCrlDer([mountName]) ⇒ <code>Promise</code>
Retrieves the current CRL in raw DER-encoded form

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>string</code> current CRL  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCrlPem"></a>
### backend/pki~getCrlPem([mountName]) ⇒ <code>Promise</code>
Retrieves the current CRL in PEM format

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>string</code> current CRL  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCrlRotate"></a>
### backend/pki~getCrlRotate([mountName]) ⇒ <code>Promise</code>
This endpoint forces a rotation of the CRL

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..genIntermediatesExported"></a>
### backend/pki~genIntermediatesExported([mountName]) ⇒ <code>Promise</code>
Generates a new private key and a CSR for signing (with private key)

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> CSR and private key  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [options.body.key_type] | <code>string</code> | <code>&quot;rsa&quot;</code> | Desired key type |
| [options.body.key_bits] | <code>string</code> | <code>2048</code> | The number of bits to use |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..genIntermediatesInternal"></a>
### backend/pki~genIntermediatesInternal([mountName]) ⇒ <code>Promise</code>
Generates a new private key and a CSR for signing (without private key)

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> CSR  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [options.body.key_type] | <code>string</code> | <code>&quot;rsa&quot;</code> | Desired key type |
| [options.body.key_bits] | <code>string</code> | <code>2048</code> | The number of bits to use |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..setSignedIntermediates"></a>
### backend/pki~setSignedIntermediates([mountName]) ⇒ <code>Promise</code>
Allows submitting the signed CA certificate corresponding to a private key

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.certificate | <code>string</code> |  | The certificate in PEM format |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..issueCertCredentials"></a>
### backend/pki~issueCertCredentials([mountName]) ⇒ <code>Promise</code>
Generates a new set of credentials (private key and certificate) based on the role named in the endpoint

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> credentials  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..revokeCertCredentials"></a>
### backend/pki~revokeCertCredentials([mountName]) ⇒ <code>Promise</code>
Revokes a certificate using its serial number

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> revocation time  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.serial_number | <code>string</code> |  | serial number of the certificate to revoke |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..createCertRole"></a>
### backend/pki~createCertRole(options, [mountName]) ⇒ <code>Promise</code>
Creates or updates the role definition

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | role name |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| [options.body.ttl] | <code>string</code> |  | Time To Live value provided as a string duration with time suffix |
| [options.body.max_ttl] | <code>string</code> |  | maximum Time To Live provided as a string duration with time suffix |
| [options.body.allow_localhost] | <code>string</code> | <code>true</code> | indicates clients can request certificates for localhost |
| [options.body.allowed_domains] | <code>string</code> |  | Designates the domains of the role |
| [options.body.allow_bare_domains] | <code>string</code> | <code>false</code> | Designates clients can request certificates matching the value of the actual domains themselves |
| [options.body.allow_subdomains] | <code>string</code> | <code>false</code> | Designates clients can request certificates with CNs that are subdomains of the CNs allowed by the other role options. |
| [options.body.allow_any_name] | <code>string</code> | <code>false</code> | Designates clients can request any CN |
| [options.body.enforce_hostnames] | <code>string</code> | <code>true</code> | Designates only valid host names are allowed for CNs, DNS SANs, and the host part of email addresses |
| [options.body.allow_ip_sans] | <code>string</code> | <code>true</code> | Designates clients can request IP Subject Alternative Names |
| [options.body.server_flag] | <code>string</code> | <code>true</code> | Designates certificates are flagged for server use |
| [options.body.client_flag] | <code>string</code> | <code>true</code> | Designates certificates are flagged for client use |
| [options.body.code_signing_flag] | <code>string</code> | <code>false</code> | Designates certificates are flagged for code signing use |
| [options.body.email_protection_flag] | <code>string</code> | <code>false</code> | Designates certificates are flagged for email protection use |
| [options.body.key_type] | <code>string</code> | <code>&quot;rsa&quot;</code> | type of key to generate for generated private keys |
| [options.body.key_bits] | <code>string</code> | <code>2048</code> | number of bits to use for the generated keys |
| [options.body.use_csr_common_name] | <code>string</code> | <code>false</code> | Designates when used with the CSR signing endpoint, the common name in the CSR will be used instead of taken from the JSON data |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..getCertRole"></a>
### backend/pki~getCertRole(options, [mountName]) ⇒ <code>Promise</code>
Queries the role definition

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Role  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | role name |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..deleteCertRole"></a>
### backend/pki~deleteCertRole(options, [mountName]) ⇒ <code>Promise</code>
Deletes the role definition

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: success  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | role name |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..genRootExported"></a>
### backend/pki~genRootExported([mountName]) ⇒ <code>Promise</code>
Generates a new self-signed CA certificate and private key

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Certificate and Private Key  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [options.body.key_type] | <code>string</code> | <code>&quot;rsa&quot;</code> | Desired key type |
| [options.body.key_bits] | <code>string</code> | <code>2048</code> | The number of bits to use |
| [options.body.max_path_length] | <code>string</code> | <code>-1</code> | the maximum path length to encode in the generated certificate |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..genRootInternal"></a>
### backend/pki~genRootInternal([mountName]) ⇒ <code>Promise</code>
Generates a new self-signed CA certificate

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [options.body.key_type] | <code>string</code> | <code>&quot;rsa&quot;</code> | Desired key type |
| [options.body.key_bits] | <code>string</code> | <code>2048</code> | The number of bits to use |
| [options.body.max_path_length] | <code>string</code> | <code>-1</code> | the maximum path length to encode in the generated certificate |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..signIntermediateWithRoot"></a>
### backend/pki~signIntermediateWithRoot([mountName]) ⇒ <code>Promise</code>
Uses the configured CA certificate to issue a certificate with appropriate values
for acting as an intermediate CA

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.csr | <code>string</code> |  | The PEM-encoded CSR |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [options.body.max_path_length] | <code>string</code> | <code>-1</code> | the maximum path length to encode in the generated certificate |
| [options.body.use_csr_values] | <code>string</code> |  | 1) Subject information, including names and alternate names, will be preserved from the CSR rather than using the values provided in the other parameters to this path; 2) Any key usages (for instance, non-repudiation) requested in the CSR will be added to the basic set of key usages used for CA certs signed by this path; 3) Extensions requested in the CSR will be copied into the issued certificate |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..signCertificate"></a>
### backend/pki~signCertificate(options, [mountName]) ⇒ <code>Promise</code>
Signs a new certificate based upon the provided CSR and the supplied parameters

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | object of options to send to API request |
| options.id | <code>string</code> |  | role name |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.csr | <code>string</code> |  | The PEM-encoded CSR |
| options.body.common_name | <code>string</code> |  | The requested CN for the certificate |
| [options.body.alt_names] | <code>string</code> |  | Requested Subject Alternative Names, in a comma-delimited list |
| [options.body.ip_sans] | <code>string</code> |  | Requested IP Subject Alternative Names, in a comma-delimited list |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

<a name="module_backend/pki..signCertificateVerbatim"></a>
### backend/pki~signCertificateVerbatim([mountName]) ⇒ <code>Promise</code>
Signs a new certificate based upon the provided CSR. Values are taken verbatim from the CSR

**Kind**: inner method of <code>[backend/pki](#module_backend/pki)</code>  
**Resolve**: <code>Object</code> Certificate  
**Reject**: <code>Error</code> An error indicating what went wrong  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options.body | <code>Object</code> |  | holds the attributes passed as inputs |
| options.body.csr | <code>string</code> |  | The PEM-encoded CSR |
| [options.body.ttl] | <code>string</code> |  | Requested Time To Live |
| [options.body.format] | <code>string</code> | <code>&quot;pem&quot;</code> | Format for returned data |
| [mountName] | <code>string</code> | <code>&quot;pki&quot;</code> | path name the pki secret backend is mounted on |

