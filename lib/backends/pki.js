var
  Vaulted = {},
  Promise = require('bluebird'),
  _ = require('lodash'),
  utils = require('../utils');

/**
 * @module backend/pki
 * @extends Vaulted
 * @desc Provides implementation for the Vault PKI Secret backend APIs
 *
 */

module.exports = function extend(Proto) {
  Vaulted.getPkiCaDerEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/ca'), 'pki');
  Vaulted.getPkiCaPemEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/ca/pem'), 'pki');
  Vaulted.getPkiCertCaEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/cert/ca'), 'pki');
  Vaulted.getPkiCertCrlEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/cert/crl'), 'pki');
  Vaulted.getPkiCertSerialEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/cert/:id'), 'pki');
  Vaulted.getPkiConfigCaEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/config/ca'), 'pki');
  Vaulted.getPkiConfigCrlEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/config/crl'), 'pki');
  Vaulted.getPkiConfigUrlsEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/config/urls'), 'pki');
  Vaulted.getPkiCrlDerEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/crl'), 'pki');
  Vaulted.getPkiCrlPemEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/crl/pem'), 'pki');
  Vaulted.getPkiCrlRotateEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/crl/rotate'), 'pki');
  Vaulted.getPkiInterGenExtEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/intermediate/generate/exported'), 'pki');
  Vaulted.getPkiInterGenIntEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/intermediate/generate/internal'), 'pki');
  Vaulted.getPkiInterSetSignedEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/intermediate/set-signed'), 'pki');
  Vaulted.getPkiIssueEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/issue/:id'), 'pki');
  Vaulted.getPkiRevokeEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/revoke'), 'pki');
  Vaulted.getPkiRolesEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/roles/:id'), 'pki');
  Vaulted.getPkiRootGenExtEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/root/generate/exported'), 'pki');
  Vaulted.getPkiRootGenIntEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/root/generate/internal'), 'pki');
  Vaulted.getPkiRootSignInterEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/root/sign-intermediate'), 'pki');
  Vaulted.getPkiSignEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/sign/:id'), 'pki');
  Vaulted.getPkiSignVerbatimEndpoint = _.partialRight(
    _.partial(Proto.validateEndpoint, '%s/sign-verbatim'), 'pki');
  _.extend(Proto, Vaulted);
};


/**
 * @method getCaDer
 * @desc Retrieves the CA certificate in raw DER-encoded form
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {string} certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCaDer = Promise.method(function getCaDer(mountName) {
  return this.getPkiCaDerEndpoint(mountName)
    .get();
});

/**
 * @method getCaPem
 * @desc Retrieves the CA certificate in PEM format
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {string} certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCaPem = Promise.method(function getCaPem(mountName) {
  return this.getPkiCaPemEndpoint(mountName)
    .get();
});

/**
 * @method getCertCa
 * @desc Retrieves CA certificate in PEM formatting in the certificate key of the JSON object
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCertCa = Promise.method(function getCertCa(mountName) {
  return this.getPkiCertCaEndpoint(mountName)
    .get();
});

/**
 * @method getCertCrl
 * @desc Retrieves the current CRL certificate in PEM formatting in the certificate key of the JSON object
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCertCrl = Promise.method(function getCertCrl(mountName) {
  return this.getPkiCertCrlEndpoint(mountName)
    .get();
});

/**
 * @method getCertSerial
 * @desc Retrieves certificate by serial number in PEM formatting in the certificate key of the JSON object
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - certificate serial number
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCertSerial = Promise.method(function getCertSerial(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiCertSerialEndpoint(mountName)
    .get({
      id: options.id
    });
});

/**
 * @method setConfigCa
 * @desc Allows submitting the CA information for the backend via a PEM file containing the
 * CA certificate and its private key, concatenated
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.pem_bundle - The key and certificate concatenated in PEM format
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setConfigCa = Promise.method(function setConfigCa(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiConfigCaEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method getConfigCrl
 * @desc Allows getting the duration for which the generated CRL should be marked valid
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} CRL duration
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getConfigCrl = Promise.method(function getConfigCrl(mountName) {
  return this.getPkiConfigCrlEndpoint(mountName)
    .get({
      headers: this.headers
    });
});

/**
 * @method setConfigCrl
 * @desc Allows setting the duration for which the generated CRL should be marked valid
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.expiry - The time until expiration
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setConfigCrl = Promise.method(function setConfigCrl(options, mountName) {
  options = utils.setDefaults(options, {
    expiry: '72h'
  });

  return this.getPkiConfigCrlEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method getConfigUrls
 * @desc Fetch the URLs to be encoded in generated certificates
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} URLs
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getConfigUrls = Promise.method(function getConfigUrls(mountName) {
  return this.getPkiConfigUrlsEndpoint(mountName)
    .get({
      headers: this.headers
    });
});

/**
 * @method setConfigUrls
 * @desc Allows setting the issuing certificate endpoints
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} [options.body.issuing_certificates] - URL values for the Issuing Certificate field
 * @param {string} [options.body.crl_distribution_points] - URL values for the CRL Distribution Points field
 * @param {string} [options.body.ocsp_servers] - URL values for the OCSP Servers field
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setConfigUrls = Promise.method(function setConfigUrls(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiConfigUrlsEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method getCrlDer
 * @desc Retrieves the current CRL in raw DER-encoded form
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {string} current CRL
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCrlDer = Promise.method(function getCrlDer(mountName) {
  return this.getPkiCrlDerEndpoint(mountName)
    .get();
});

/**
 * @method getCrlPem
 * @desc Retrieves the current CRL in PEM format
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {string} current CRL
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCrlPem = Promise.method(function getCrlPem(mountName) {
  return this.getPkiCrlPemEndpoint(mountName)
    .get();
});

/**
 * @method getCrlRotate
 * @desc This endpoint forces a rotation of the CRL
 *
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCrlRotate = Promise.method(function getCrlRotate(mountName) {
  return this.getPkiCrlRotateEndpoint(mountName)
    .get({
      headers: this.headers
    });
});

/**
 * @method genIntermediatesExported
 * @desc Generates a new private key and a CSR for signing (with private key)
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [options.body.key_type=rsa] - Desired key type
 * @param {string} [options.body.key_bits=2048] - The number of bits to use
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} CSR and private key
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.genIntermediatesExported = Promise.method(function genIntermediatesExported(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem',
    key_type: 'rsa',
    key_bits: '2048'
  });

  return this.getPkiInterGenExtEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method genIntermediatesInternal
 * @desc Generates a new private key and a CSR for signing (without private key)
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [options.body.key_type=rsa] - Desired key type
 * @param {string} [options.body.key_bits=2048] - The number of bits to use
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} CSR
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.genIntermediatesInternal = Promise.method(function genIntermediatesInternal(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem',
    key_type: 'rsa',
    key_bits: '2048'
  });

  return this.getPkiInterGenIntEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method setSignedIntermediates
 * @desc Allows submitting the signed CA certificate corresponding to a private key
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.certificate - The certificate in PEM format
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.setSignedIntermediates = Promise.method(function setSignedIntermediates(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiInterSetSignedEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method issueCertCredentials
 * @desc Generates a new set of credentials (private key and certificate) based on the role named in the endpoint
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} credentials
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.issueCertCredentials = Promise.method(function issueCertCredentials(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem'
  });

  return this.getPkiIssueEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method revokeCertCredentials
 * @desc Revokes a certificate using its serial number
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.serial_number - serial number of the certificate to revoke
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} revocation time
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.revokeCertCredentials = Promise.method(function revokeCertCredentials(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiRevokeEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method createCertRole
 * @desc Creates or updates the role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - role name
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} [options.body.ttl] - Time To Live value provided as a string duration with time suffix
 * @param {string} [options.body.max_ttl] - maximum Time To Live provided as a string duration with time suffix
 * @param {string} [options.body.allow_localhost=true] - indicates clients can request certificates for localhost
 * @param {string} [options.body.allowed_domains] - Designates the domains of the role
 * @param {string} [options.body.allow_bare_domains=false] - Designates clients can request certificates
 * matching the value of the actual domains themselves
 * @param {string} [options.body.allow_subdomains=false] - Designates clients can request certificates
 * with CNs that are subdomains of the CNs allowed by the other role options.
 * @param {string} [options.body.allow_any_name=false] - Designates clients can request any CN
 * @param {string} [options.body.enforce_hostnames=true] - Designates only valid host names are allowed
 * for CNs, DNS SANs, and the host part of email addresses
 * @param {string} [options.body.allow_ip_sans=true] - Designates clients can request IP Subject Alternative Names
 * @param {string} [options.body.server_flag=true] - Designates certificates are flagged for server use
 * @param {string} [options.body.client_flag=true] - Designates certificates are flagged for client use
 * @param {string} [options.body.code_signing_flag=false] - Designates certificates are flagged for code
 * signing use
 * @param {string} [options.body.email_protection_flag=false] - Designates certificates are flagged for email
 * protection use
 * @param {string} [options.body.key_type=rsa] - type of key to generate for generated private keys
 * @param {string} [options.body.key_bits=2048] - number of bits to use for the generated keys
 * @param {string} [options.body.use_csr_common_name=false] - Designates when used with the CSR signing endpoint,
 * the common name in the CSR will be used instead of taken from the JSON data
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.createCertRole = Promise.method(function createCertRole(options, mountName) {
  options = utils.setDefaults(options, {
    allow_localhost: true,
    allow_bare_domains: false,
    allow_subdomains: false,
    allow_any_name: false,
    enforce_hostnames: true,
    allow_ip_sans: true,
    server_flag: true,
    client_flag: true,
    code_signing_flag: false,
    email_protection_flag: false,
    use_csr_common_name: false,
    key_type: 'rsa',
    key_bits: '2048'
  });

  return this.getPkiRolesEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method getCertRole
 * @desc Queries the role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - role name
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Role
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.getCertRole = Promise.method(function getCertRole(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiRolesEndpoint(mountName)
    .get({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method deleteCertRole
 * @desc Deletes the role definition
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - role name
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve success
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.deleteCertRole = Promise.method(function deleteCertRole(options, mountName) {
  options = utils.setDefaults(options);
  return this.getPkiRolesEndpoint(mountName)
    .delete({
      headers: this.headers,
      id: options.id
    });
});

/**
 * @method genRootExported
 * @desc Generates a new self-signed CA certificate and private key
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [options.body.key_type=rsa] - Desired key type
 * @param {string} [options.body.key_bits=2048] - The number of bits to use
 * @param {string} [options.body.max_path_length=-1] - the maximum path length to encode in the generated certificate
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Certificate and Private Key
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.genRootExported = Promise.method(function genRootExported(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem',
    key_type: 'rsa',
    key_bits: 2048,
    max_path_length: -1
  });

  return this.getPkiRootGenExtEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method genRootInternal
 * @desc Generates a new self-signed CA certificate
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [options.body.key_type=rsa] - Desired key type
 * @param {string} [options.body.key_bits=2048] - The number of bits to use
 * @param {string} [options.body.max_path_length=-1] - the maximum path length to encode in the generated certificate
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.genRootInternal = Promise.method(function genRootInternal(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem',
    key_type: 'rsa',
    key_bits: 2048,
    max_path_length: -1
  });

  return this.getPkiRootGenIntEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method signIntermediateWithRoot
 * @desc Uses the configured CA certificate to issue a certificate with appropriate values
 * for acting as an intermediate CA
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.csr - The PEM-encoded CSR
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [options.body.max_path_length=-1] - the maximum path length to encode in the generated certificate
 * @param {string} [options.body.use_csr_values] - 1) Subject information, including names and alternate names,
 * will be preserved from the CSR rather than using the values provided in the other parameters to this path;
 * 2) Any key usages (for instance, non-repudiation) requested in the CSR will be added to the basic
 * set of key usages used for CA certs signed by this path;
 * 3) Extensions requested in the CSR will be copied into the issued certificate
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.signIntermediateWithRoot = Promise.method(function signIntermediateWithRoot(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem',
    max_path_length: -1
  });

  return this.getPkiRootSignInterEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});

/**
 * @method signCertificate
 * @desc Signs a new certificate based upon the provided CSR and the supplied parameters
 *
 * @param {Object} options - object of options to send to API request
 * @param {string} options.id - role name
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.csr - The PEM-encoded CSR
 * @param {string} options.body.common_name - The requested CN for the certificate
 * @param {string} [options.body.alt_names] - Requested Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ip_sans] - Requested IP Subject Alternative Names, in a comma-delimited list
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.signCertificate = Promise.method(function signCertificate(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem'
  });

  return this.getPkiSignEndpoint(mountName)
    .post({
      headers: this.headers,
      id: options.id,
      body: options.body
    });
});

/**
 * @method signCertificateVerbatim
 * @desc Signs a new certificate based upon the provided CSR. Values are taken verbatim from the CSR
 *
 * @param {Object} options.body - holds the attributes passed as inputs
 * @param {string} options.body.csr - The PEM-encoded CSR
 * @param {string} [options.body.ttl] - Requested Time To Live
 * @param {string} [options.body.format=pem] - Format for returned data
 * @param {string} [mountName=pki] - path name the pki secret backend is mounted on
 * @resolve {Object} Certificate
 * @reject {Error} An error indicating what went wrong
 * @return {Promise}
 */
Vaulted.signCertificateVerbatim = Promise.method(function signCertificateVerbatim(options, mountName) {
  options = utils.setDefaults(options, {
    format: 'pem'
  });

  return this.getPkiSignVerbatimEndpoint(mountName)
    .post({
      headers: this.headers,
      body: options.body
    });
});
