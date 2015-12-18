#
# WARNING WARNING WARNING WARNING WARNING WARNING
#
#              !! Insecure Setup !!
#
# WARNING WARNING WARNING WARNING WARNING WARNING
#
#           !! DO NOT USE IN PROD !!
#
backend "consul" {
  address = "127.0.0.1:8500"
  path = "vault"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = 1
}

disable_mlock = true
