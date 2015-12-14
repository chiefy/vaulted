VERSION := $(shell jq .version package.json)
DOCKER_MACHINE_HOST := "docker-host"
DOCKER_COMPOSE_TEST := "docker-compose-test.yml"
DOCKER_MACHINE_IP := $(shell docker-machine ip $(DOCKER_MACHINE_HOST))

.PHONY: clean build run-local stop-local test

node_modules:
	@npm install

run-local:
	@docker-compose -f $(DOCKER_COMPOSE_TEST) --x-networking up -d && sleep 5

stop-local:
	@docker-compose -f $(DOCKER_COMPOSE_TEST) stop && \
	docker-compose -f $(DOCKER_COMPOSE_TEST) rm -fv

test: node_modules run-local
	@VAULT_HOST=$(DOCKER_MACHINE_IP) \
	CONSUL_HOST=$(DOCKER_MACHINE_IP) \
	npm run test

test-watch: node_modules
	@mocha -G -R spec -w tests/**/*.js

