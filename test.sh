#!/usr/bin/env bash

vault=${VAULT_HOST:-'vault'}

LOG_EVERY=5
SECONDS=0
CONSUL_READY=0

while [ ${CONSUL_READY} -eq 0 ]
do
  result=$(curl -s http://"${vault}":8500/v1/status/leader)
  if [[ "$result" == *":8300"* ]]
  then
    CONSUL_READY=1
    echo "Consul client for Vault is ready, time to test"
    break
  fi

  # print every 5 seconds only
  if [ $((SECONDS % LOG_EVERY)) -eq 0 ]
  then
    echo "$(date): $result"
  fi

  # pause before trying again to avoid pounding the client
  sleep 1
done

# pause for a moment and then start running
sleep .5

npm install --quiet
npm run coverage
